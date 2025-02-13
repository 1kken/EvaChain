import { createSqlAgent, SqlToolkit } from 'langchain/agents/toolkits/sql';
import { SqlDatabase } from 'langchain/sql_db';
import { DataSource } from 'typeorm';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { STATUS, OPEN_AI_API_KEY, DB_PASSWORD } from '$env/static/private';

//+++++++++++++++++++++++++++++ SET DATABASE +++++++++++++++++++++++++++++
const datasource = new DataSource({
	type: 'postgres',
	url:
		STATUS === 'DEV'
			? 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
			: `postgresql://postgres.xixattpbfetzpwecbkde:${DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,

	ssl:
		STATUS === 'DEV'
			? false
			: {
					rejectUnauthorized: false
				}
});

const db = await SqlDatabase.fromDataSourceParams({
	appDataSource: datasource
});

//+++++++++++++++++++++++++++++ SET LLM +++++++++++++++++++++++++++++
const llm = new ChatOpenAI({
	model: 'gpt-4o',
	temperature: 0,
	apiKey: OPEN_AI_API_KEY
});

//+++++++++++++++++++++++++++++ SET PROMPT +++++++++++++++++++++++++++++

const sqlAgentSystemPrompt = `You are an agent designed to interact with a SQL database.
Given an input question, create a syntactically correct {dialect} query to run, then look at the results of the query and return the answer.
Unless the user specifies a specific number of examples they wish to obtain, always limit your query to at most {top_k} results.
You can order the results by a relevant column to return the most interesting examples in the database.
Never query for all the columns from a specific table, only ask for the relevant columns given the question.
You have access to tools for interacting with the database.
Only use the below tools. Only use the information returned by the below tools to construct your final answer.
You MUST double check your query before executing it. If you get an error while executing a query, rewrite the query and try again.

DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database.

To start you should ALWAYS look at the tables in the database to see what you can query.
Do NOT skip this step.
Then you should query the schema of the most relevant tables.

if any greetings, say "Hello👋👋! I am an AI agent🤖🤖 designed to answer all your questions❓! (as long as i can)🥺. How can I help you today?😀"
if any goodbyes, say "Goodbye👋👋! I hope I was able to help you today!😀"`;

const chatPrompt = ChatPromptTemplate.fromMessages([sqlAgentSystemPrompt]);

const systemMessage = await chatPrompt.format({
	dialect: 'postgresql',
	top_k: 5
});

// //+++++++++++++++++++++++++++++ SET AGENT +++++++++++++++++++++++++++++
const toolkit = new SqlToolkit(db, llm);
const tools = toolkit.getTools();

const agent = createReactAgent({
	llm: llm,
	tools: tools,
	stateModifier: systemMessage
});

export async function getResponse(query: string) {
	let input = {
		messages: [
			{
				role: 'user',
				content: query
			}
		]
	};
	const response = await agent.invoke(input);

	return response.messages[response.messages.length - 1].content.toString();
}
