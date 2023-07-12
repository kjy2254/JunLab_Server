const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "IITP API",
            description:
                "센서 데이터 수집을 위한 RestFul API",
        },
        servers: [
            {
                url: "http://junlab.postech.ac.kr:880", // 요청 URL
            },
        ],
    },
    apis: ["./routes/*.js"], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }