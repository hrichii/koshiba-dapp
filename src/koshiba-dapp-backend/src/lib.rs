use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
    TransformContext, TransformFunc
};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct ResponseData {
    message: String,
    timestamp: String,
}

#[ic_cdk::update]
async fn greet(name: String) -> String {
    let host = "jsontest.deno.dev";
    let url = format!("https://{host}/?name={name}");

    let request_headers = vec![
        HttpHeader {
            name: "Host".to_string(),
            value: format!("{host}:443"),
        },
        HttpHeader {
            name: "User-Agent".to_string(),
            value: "test".to_string(),
        },
    ];

    let request = CanisterHttpRequestArgument {
        url: url.to_string(),
        method: HttpMethod::GET,
        body: None,
        max_response_bytes: None,
        transform: Some(TransformContext {
            function: TransformFunc(candid::Func {
                principal: ic_cdk::api::id(),
                method: "transform".to_string(),
            }),
            context: vec![],
        }),
        headers: request_headers,
    };

    let cycles = 230_949_972_000;
    match http_request(request, cycles).await {
        Ok((response,)) => {
            if response.status == 200u64 {
                String::from_utf8(response.body).unwrap()
            } else {
                format!("HTTPS Error. Status:{}", response.status)
            }
        },
        Err((r, m)) => {
            format!("The http_request resulted into error. RejectionCode: {r:?}, Error: {m}")
        }
    }
}

#[ic_cdk::query]
fn transform(raw: TransformArgs) -> HttpResponse {
    let headers = vec![
        HttpHeader {
            name: "Content-Security-Policy".to_string(),
            value: "default-src 'self'".to_string(),
        },
        HttpHeader {
            name: "Referrer-Policy".to_string(),
            value: "strict-origin".to_string(),
        },
        HttpHeader {
            name: "Permissions-Policy".to_string(),
            value: "geolocation=(self)".to_string(),
        },
        HttpHeader {
            name: "Strict-Transport-Security".to_string(),
            value: "max-age=63072000".to_string(),
        },
        HttpHeader {
            name: "X-Frame-Options".to_string(),
            value: "DENY".to_string(),
        },
        HttpHeader {
            name: "X-Content-Type-Options".to_string(),
            value: "nosniff".to_string(),
        },
    ];

    let mut res = HttpResponse {
        status: raw.response.status.clone(),
        body: raw.response.body.clone(),
        headers,
        ..Default::default()
    };

    if res.status == 200u64 {
        let data:ResponseData = serde_json::from_slice(&raw.response.body).unwrap();
        res.body = data.message.into_bytes()
    } else {
        ic_cdk::api::print(format!("Received an error from coinbase: err = {:?}", raw));
    }
    res
}

ic_cdk_macros::export_candid!();