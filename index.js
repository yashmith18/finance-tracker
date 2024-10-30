const { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

const dynamoClient = new DynamoDBClient();

exports.handler = async (event) => {
    let response;
    console.log("Received event:", JSON.stringify(event)); // Log incoming event

    try {
        switch (event.httpMethod) {
            // **POST - Create**
            case 'POST':
                console.log("Handling POST request");
                const postBody = JSON.parse(event.body);
                await dynamoClient.send(new PutItemCommand({
                    TableName: 'FinanceTracker',
                    Item: {
                        transactionId: { S: postBody.transactionId },
                        type: { S: postBody.type },
                        amount: { N: String(postBody.amount) },
                        category: { S: postBody.category },
                        date: { S: postBody.date }
                    }
                }));
                response = { statusCode: 201, body: JSON.stringify({ message: "Transaction created!" }) };
                break;

            // **GET - Read**
            case 'GET':
                console.log("Handling GET request");
                const scanResult = await dynamoClient.send(new ScanCommand({ TableName: 'FinanceTracker' }));
                response = { statusCode: 200, body: JSON.stringify(scanResult.Items) };
                break;

            // **PUT - Update**
            case 'PUT':
                console.log("Handling PUT request");
                const putBody = JSON.parse(event.body);
                await dynamoClient.send(new UpdateItemCommand({
                    TableName: 'FinanceTracker',
                    Key: { transactionId: { S: putBody.transactionId } },
                    UpdateExpression: "SET #type = :type, amount = :amount, category = :category, #date = :date",
                    ExpressionAttributeNames: {
                        "#type": "type",
                        "#date": "date"
                    },
                    ExpressionAttributeValues: {
                        ":type": { S: putBody.type },
                        ":amount": { N: String(putBody.amount) },
                        ":category": { S: putBody.category },
                        ":date": { S: putBody.date }
                    }
                }));
                response = { statusCode: 200, body: JSON.stringify({ message: "Transaction updated!" }) };
                break;

            // **DELETE - Delete**
            case 'DELETE':
                console.log("Handling DELETE request");
                const deleteBody = JSON.parse(event.body);
                await dynamoClient.send(new DeleteItemCommand({
                    TableName: 'FinanceTracker',
                    Key: { transactionId: { S: deleteBody.transactionId } }
                }));
                response = { statusCode: 200, body: JSON.stringify({ message: "Transaction deleted!" }) };
                break;

            // **Unsupported Method**
            default:
                console.log("Unsupported HTTP method:", event.httpMethod);
                response = { statusCode: 400, body: JSON.stringify({ message: "Unsupported HTTP method" }) };
        }
    } catch (error) {
        console.error("Error:", error);
        response = { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
    }

    response.headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    return response;
};
