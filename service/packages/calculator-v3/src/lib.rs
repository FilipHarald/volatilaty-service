use std::sync::Mutex;
use neon::prelude::*;
use once_cell::sync::Lazy;

const VERSION: &str = "3";
const TIMESTAMP_INDEX: usize = 0;
const MIDPRICE_INDEX: usize = 3;

static PREVIOUS_BOOKS: Lazy<Mutex<Vec<[f64; 4]>>> = Lazy::new(|| Mutex::new(vec![]));

fn update(mut cx: FunctionContext) -> JsResult<JsObject> {

    // --------------- UPDATE BOOKS
    let timestamp_ms = cx.argument::<JsNumber>(0)?;
    let bids = cx.argument::<JsArray>(1)?.to_vec(&mut cx).unwrap();
    let asks = cx.argument::<JsArray>(2)?.to_vec(&mut cx).unwrap();

    let ts = timestamp_ms.value(&mut cx) as f64;
    let best_bid = bids
        .into_iter()
        .rfind(|b| {
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
        .find(|a| {
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
    if best_bid  > 0.0 && best_ask  > 0.0 {
        let book: [f64; 4] = [
            ts,
            best_bid,
            best_ask,
            (best_bid + best_ask) / 2.0
        ];
        PREVIOUS_BOOKS.lock().unwrap().insert(0, book);
    }

    let outdated_threshold = ts - 200.0;
    PREVIOUS_BOOKS.lock().unwrap()
        .retain(|prev_book| prev_book[TIMESTAMP_INDEX] > outdated_threshold);

    // --------------- CALCULATE
    let mut sum: f64 = 0.0;

    let second_last_index = PREVIOUS_BOOKS.lock().unwrap().len() - 1;

    for i in 0..second_last_index {
        let curr_midprice = PREVIOUS_BOOKS.lock().unwrap().get(i).unwrap()[MIDPRICE_INDEX];
        let curr_ts = PREVIOUS_BOOKS.lock().unwrap().get(i).unwrap()[TIMESTAMP_INDEX];
        let next_midprice = PREVIOUS_BOOKS.lock().unwrap().get(i + 1).unwrap()[MIDPRICE_INDEX];
        let next_ts = PREVIOUS_BOOKS.lock().unwrap().get(i + 1).unwrap()[TIMESTAMP_INDEX];

        sum += (curr_midprice - next_midprice).abs()
            / curr_midprice
            / (curr_ts - next_ts);
    }
    let volatility: f64 = sum / second_last_index as f64 * 10000.0;

    // --------------- BUILDING RETURN OBJ
    let obj = cx.empty_object();
    let vol = cx.number(volatility);
    let prev_book_size = cx.number((second_last_index + 1) as f64);

    let version = cx.string(VERSION);
    obj.set(&mut cx, "version", version);
    obj.set(&mut cx, "volatility", vol);
    obj.set(&mut cx, "prevBooksSize", prev_book_size);
    Ok(obj)
}

fn calculate(books: [f64; 4]) -> f64 {
    return 0.0
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("update", update)?;
    Ok(())
}
