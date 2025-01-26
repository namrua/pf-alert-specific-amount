import KafkaService from "./KafkaService";
export const subscribeEvent = async (): Promise<void> => {
  let kafkaService = new KafkaService();
  kafkaService.fetchData();
};

