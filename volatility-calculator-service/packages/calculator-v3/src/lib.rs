use std::sync::Mutex;
use neon::prelude::*;
use once_cell::sync::Lazy;

const VERSION: &str = "3";

static PREVIOUS_BOOKS: Lazy<Mutex<Vec<[f64; 4]>>> = Lazy::new(|| Mutex::new(vec![]));

fn update(mut cx: FunctionContext) -> JsResult<JsObject> {
    // UPDATE BOOKS
    let version = cx.string(VERSION);

    let timestamp_ms = cx.argument::<JsNumber>(0)?;
    let bids = cx.argument::<JsArray>(1)?.to_vec(&mut cx).unwrap();
    let asks = cx.argument::<JsArray>(2)?.to_vec(&mut cx).unwrap();

    let ts = timestamp_ms.value(&mut cx) as f64;
    let best_bid = bids
        .into_iter()
        .find(|b| {
            let size = b
                .downcast::<JsObject, _>(&mut cx).unwrap()
                .get_value(&mut cx, "size").unwrap()
                .downcast::<JsString, _>(&mut cx).unwrap()
                .value(&mut cx);
            return size.parse::<f64>().unwrap() > 0.0;
        }).unwrap()
        .downcast::<JsObject, _>(&mut cx).unwrap()
        .get_value(&mut cx, "price").unwrap()
        .downcast::<JsString, _>(&mut cx).unwrap()
        .value(&mut cx).parse::<f64>().unwrap();
    let best_ask = asks
        .into_iter()
        .rfind(|a| {
            let size = a
                .downcast::<JsObject, _>(&mut cx).unwrap()
                .get_value(&mut cx, "size").unwrap()
                .downcast::<JsString, _>(&mut cx).unwrap()
                .value(&mut cx);
            return size.parse::<f64>().unwrap() > 0.0;
        }).unwrap()
        .downcast::<JsObject, _>(&mut cx).unwrap()
        .get_value(&mut cx, "price").unwrap()
        .downcast::<JsString, _>(&mut cx).unwrap()
        .value(&mut cx).parse::<f64>().unwrap();
    if best_bid <= 0.0 || best_ask <= 0.0 {
    }

    let book: [f64; 4] = [
        ts,
        best_bid,
        best_ask,
        (best_bid + best_ask) / 2.0
    ];
    PREVIOUS_BOOKS.lock().unwrap().insert(0, book);

    let outdated_threshold = ts - 200.0;
    PREVIOUS_BOOKS
        .lock().unwrap()
        .retain(|prev_book| prev_book[0] > outdated_threshold);

    // CALCULATE
    // TODO

    let obj = cx.empty_object();
    obj.set(&mut cx, "version", version);
    Ok(obj)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("update", update)?;
    Ok(())
}
