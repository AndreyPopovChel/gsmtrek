# Getting MEAN application code

This is the code for the gsmtrek

Формат запроса:  (в теле http запроса будет набор данных в формате json)
{
"sn":"123456",
"ctr":"1",
"batt":"87",
"date":"yyyyMMdd",
"time":"hhmmss",
"lat":"+dd.dddddd",
"lon":"+dd.dddddd",
"gpsvis":"10",
"gnsvis":"11",
"satused":"6",
"gsmlc":"gsmlocationcode",
"gsmlat":"+ddd.dddddd",
"gsmlon":"+ddd.dddddd",
"gsmdate":"yyyyMMdd",
"gsmtime":"hhmmss",
"humidity":"100",
"temperature 1":"±dd.dd",
"pressurebarom ":"1200",
"temperature 2":" ±dd.dd",
"TVOC ":"60000",
"CO2eq":"60000",
"acoustic":"120"
}


{
"sn":"123456",
"ctr":"1",
"cfgLock":"1",
"updateTimeMin":"240",
"smsEnable":"1",
"phoneNumber":"+7XXXXXXXXXX",
"paramsmsEnable": "1110000000011111100000"
}

`npm install`