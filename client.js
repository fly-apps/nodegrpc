var PROTO_PATH=__dirname+'/grpcfly.proto';

var grpc=require('grpc');
var proto_loader=require("@grpc/proto-loader");
var packageDefiniton = proto_loader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
var grpcfly_proto=grpc.loadPackageDefinition(packageDefiniton).GRPCFly;

function main() {
    serviceurl=process.env.FLYGRPC_URL || "localhost:8080";
    var client=new grpcfly_proto.GRPCFlyService(serviceurl,grpc.credentials.createInsecure());

    client.Set({key:"test",value:"testvalue"}, (err,response) => {
        console.log(response.success)
        client.Get({key:"test"}, (err,response) => {
            console.log(response.success,response.value)
        });
    });

}

main();
