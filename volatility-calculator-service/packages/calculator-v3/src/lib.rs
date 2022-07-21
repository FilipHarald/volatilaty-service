use std::sync::{Mutex, atomic::{AtomicI64, Ordering}};
use neon::prelude::*;
use lazy_static::lazy_static;

const VERSION: &str = "3";

lazy_static! {
    static ref PREVIOUS_BOOKS: Mutex<Vec<i64>> = Mutex::new(vec![0]);
}

static MEM: AtomicI64 = AtomicI64::new(0);
// const INITIAL_BOOKS: Vec<[i64; 4]> = Vec::new();
// static previous_books: AtomicPtr<[i64; 4]> = AtomicPtr::new(INITIAL_BOOKS);
// static data: Arc<Mutex<i32>> = Arc::new(Mutex::new(0));

fn test(mut cx: FunctionContext) -> JsResult<JsNumber> {
    let arg1 = cx.argument::<JsNumber>(0)?.value(&mut cx);
    let prev_val = MEM.fetch_add(arg1 as i64, Ordering::SeqCst);
    Ok(cx.number(prev_val as f64))
}

fn update(mut cx: FunctionContext) -> JsResult<JsObject> {
    let version = cx.string(VERSION);

    let arg1 = cx.argument::<JsNumber>(0)?;
    PREVIOUS_BOOKS.lock().unwrap().push(1);
    let te1: i64 = PREVIOUS_BOOKS.lock().unwrap().iter().sum::<i64>();
    let te2 = cx.number(te1 as f64);

    let obj = cx.empty_object();
    obj.set(&mut cx, "version", version);
    obj.set(&mut cx, "testing", te2);
    Ok(obj)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("test", test)?;
    cx.export_function("update", update)?;
    Ok(())
}
