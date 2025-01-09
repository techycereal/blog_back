var admin = require("firebase-admin");
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_ID = process.env.PRIVATE_KEY_ID
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_EMAIL = process.env.CLIENT_EMAIL
const CLIENT_CERT = process.env.CLIENT_CERT
const PROJECT_ID = process.env.PROJECT_ID
admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": PROJECT_ID,
    "private_key_id": "c277c745ade271cec910a111a2de0e3df6d129bd",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDCf0HjjVpWiSyn\n1OdifFxj1hwRfbza0A/CyXjCrjgvjLNlhnY0IR+InjsW7sqk8MQYuTqQKe6zgsQn\niRgzoh1kJFsEoP8i91Jzl2iQl5mpv1Kpk8wG0Ke6smAF3XDVtcXRae/WshpW61jX\nYnH7KRU1ubGkubQS6OZ3wC/K8TsPNZDxKFr8BWf8igMVtb4sQFsd6jAAOKlFM901\nDamSdlDPn9guDc0GmTEtBlCsKYPxyjdmVrInlqqdwFboqZxjSt+rzZemFgMuumSc\nDoi/CzNSaV4KA15M0WMTppUxNw6F7j82Jc38CQNyC6oL67M3bMHsRJObvAB1Rqlk\n8Cpn3y5ZAgMBAAECggEAALMu5o95bcQZsXFQviHPPpXJxEPY+idxjmjwOrfnQio2\n8h12VL3jm3Qvw+PnaKYhcPkrVy+5cewEiUdGnvqdP7aUR8YU06MYWq9jPBkydNr/\nXU9yXZ2ilgBYIyW14AiRHD9/pBWjv26UP89m7Uz5waJPH07tYybBja4Ta0mzM+QC\n5HIERlIdcx34DdSroa4yOfjMvxF9cNgCNC/Z9F8T2wZCcn1VnF7okC3DOwNnF8YO\nZpZS7izaOPbDz1oDK7iOKE7lgWqxDf4XRzRx3P2zCImMFv5wWZjtXsJYBd9RTr4y\nmefcwWMAW572S33LdbSvDqnqEugEsRyORPG86ne4EQKBgQDqY9B7RysbXP2ex2c7\nQwH13b3RdhogFzThKlrx36zqlswcKQ8X2YA0pOQKk7e0+GypRDZlphtDfRqed/Pq\nllX0RpZ0eaAJlRO80XVrSEweGpEHLzOYw/TJY2RRPgXvZjhMQ2+eeGAIfUouAKjh\nVZSihNDZyYQQHu2qOzfcsOh1UQKBgQDUbd+eF7fUR0sURoZz7941TvqzBBilfcVn\ncJCVWvs0RWVV/QAqpjWv1m4VEkjmA6ap8WYgGAHWjiAfw1n3BB1J22FXJW7BLuC4\nNE7WtUHxhLQvfiP1Mdh1qpltpAlptn3uX5zZcsSW9kchnDylh2pMGmajekmfHo4h\n0mio6RCGiQKBgQC9GQQUwSkE7XPsCoG9bOUC//9pIrgXFcHiurIem088/6XyPing\nGuh1EGauJdi7FwVLVi3wuh8axq6YFLxjkSANcHlnxMwZjv0ag34QrIZEbzh8LFeb\nMtSlORuw87IEH1riJDHEDuejUblr/bpB+TJuH2sDmbGC9ADYKuh5kvwn0QKBgQCC\nUACMj8oyS6XQA095kZ0DoLaD2LBx3MybHt9i79QIBcYbUL+oahunCWiwPm4/w9+a\ngr5+U5vVDYzBT2pB8OEyrIRzHEBr+6DY/yWZ6slQKnMKa1wNjw1VaVkDfExV8CAi\neb7TWeclIGEUSi6d8IsRsmRiRqMhHHJeZx/S9l4v2QKBgBGqXRwufKSvKGBlGRQ5\nf3n0wNmsymQ6HZUX2l5HsMCE0d/6v/kyYVi3N4LJwVLitLPA5ZhvnL0kKCTU2yYk\nqXoqHIQdPa20LtPElaJStbqTDmwhbKXPVxZaW39ObBVZC981kSEmRHfzJjyWt5oq\nNudglffjhLacKDtlSqD6sFE6\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-v65hm@blog-app-79625.iam.gserviceaccount.com",
    "client_id": "108238349508970383457",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-v65hm%40blog-app-79625.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  )
});
const db = admin.firestore()
module.exports = { admin, db, }
