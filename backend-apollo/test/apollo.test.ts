import { createTestClient } from "apollo-server-testing";
import { apollo } from "../src";

const { query, mutate } = createTestClient(apollo);

