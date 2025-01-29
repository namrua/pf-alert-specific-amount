import { Kafka, logLevel } from "kafkajs";
import { redisPub } from "./RedisService";
import TelegramMessageSender from "./TelegramMessageSender";
import Utils from "./Utils";
import TelegramMessageBuilder from "./TelegramMessageBuilder";
import { PfTokenAmountResponse } from "./ResponseModel";
import { ClickHouseService } from "./ClickHouseService";
import { ClickhouseQuery } from "./Queries";

const kafkaBroker = "49.12.174.250:9092";
const tradeTopic = "sol-tx";

const groupId = -1002365301981;

//namzua
// const groupId = -1002255160929;


class KafkaService {
    totalCount = 0; // Tổng số message nhận được
    countPerSecond = 0; // Đếm số message mỗi giây (RPS)
    kafka: Kafka;

    constructor() {
        this.kafka = new Kafka({
            clientId: "my-app",
            brokers: [kafkaBroker],
            logLevel: logLevel.ERROR,
        });
    }

    async fetchData() {
        const tradingConsumere = this.kafka.consumer({ groupId: `sol-tx-group-pf-test7` });
        await tradingConsumere.connect();

        await tradingConsumere.subscribe({ topic: tradeTopic, fromBeginning: false });

        await tradingConsumere.run({
            eachBatch: async ({ batch, resolveOffset, heartbeat, commitOffsetsIfNecessary }) => {
                console.log('Received trading batch:', batch.messages.length);
                try {
                    const parsedMessages: any[] = [];

                    for (const message of batch.messages) {
                        const messageValue = message.value?.toString();
                        if (messageValue) {
                            try {
                                // Parse từng message và thêm vào batch xử lý
                                const parsedMessage = JSON.parse(messageValue);
                                parsedMessage.offsetNumber = message.offset;
                                parsedMessages.push(parsedMessage);
                            } catch (error) {
                                console.error('Error parsing message:', error);
                            }
                        } else {
                            console.log('Received empty message');
                        }
                        resolveOffset(message.offset);
                    }
                    if (parsedMessages.length > 0) {
                        // await this.handleTradingDataBatch(parsedMessages);
                        console.log('Received trading batch:', parsedMessages.length);
                        await this.sendpfAlert(parsedMessages);
                    }

                    await commitOffsetsIfNecessary();
                    await heartbeat();
                } catch (error) {
                    console.error('Error processing trading batch:', error);
                }
            },
        });

    }

    async sendpfAlert(tradingRequests: any[]) {
        let filteredData = tradingRequests.filter(tradingRequest => tradingRequest.token_amount == 793100000
            && ((tradingRequest.exchange == "pump" && ["buy", "sell"].includes(tradingRequest.trade_type))));
        for (let tradingRequest of filteredData) {
            const [deployerHistory, tokenInfo] = await Promise.all([
                ClickHouseService.query<DeployerHistory>(ClickhouseQuery.GET_DEPLOYER_HISTORY, { mintId: tradingRequest.token }),
                ClickHouseService.query<any>(ClickhouseQuery.GET_TOKEN_INFO, { mintId: tradingRequest.token }),
            ]) as unknown as [DeployerHistory, any];

            const response: PfTokenAmountResponse = {
                mintId: tradingRequest.token,
                made: deployerHistory.made,
                officialLinks: JSON.parse(tokenInfo.officialLinks),
            }
            const res = TelegramMessageBuilder.buildMessage(response);
            await TelegramMessageSender.sendMessage(groupId, res, null);
        }
    }

}
export default KafkaService;
