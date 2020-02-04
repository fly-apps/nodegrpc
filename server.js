
// Set up the gRPC loader
var PROTO_PATH = __dirname + '/grpcfly.proto';
var grpc = require('grpc');
var proto_loader = require("@grpc/proto-loader");
var packageDefiniton = proto_loader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
var grpcfly_proto = grpc.loadPackageDefinition(packageDefiniton).GRPCFly;

// Setup Redis
var redis = require('redis');
var redis_url = process.env.FLY_REDIS_CACHE_URL || "redis://localhost:6379"
var client = redis.createClient({ url: redis_url })

function Set(call, callback) {
  key = call.request.key;
  value = call.request.value;
  client.SET(key, value, function (err) {
    callback(null, { success: true });
  });
}

function Get(call, callback) {
  key = call.request.key;
  client.GET(key, function (err, reply) {
    callback(null, { success: true, value: reply });
  });
}

function main() {
  var server = new grpc.Server();
  server.addService(grpcfly_proto.GRPCFlyService.service, { Set: Set, Get: Get });
  server.bind('0.0.0.0:7777', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();