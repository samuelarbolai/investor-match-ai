------------------https://docs.langchain.com/oss/python/langchain/overview --------------https://docs.langchain.com/oss/python/langchain/overview---------------https://docs.langchain.com/oss/python/langchain/overview----------


# LangChain overview

<Callout icon="bullhorn" color="#DFC5FE" iconType="regular">
  **LangChain v1.x is now available!**

  For a complete list of changes and instructions on how to upgrade your code, see the [release notes](/oss/python/releases/langchain-v1) and [migration guide](/oss/python/migrate/langchain-v1).

  If you encounter any issues or have feedback, please [open an issue](https://github.com/langchain-ai/docs/issues/new?template=01-langchain.yml) so we can improve. To view v0.x documentation, [go to the archived content](https://github.com/langchain-ai/langchain/tree/v0.3/docs/docs).
</Callout>

LangChain is the easiest way to start building agents and applications powered by LLMs. With under 10 lines of code, you can connect to OpenAI, Anthropic, Google, and [more](/oss/python/integrations/providers/overview). LangChain provides a pre-built agent architecture and model integrations to help you get started quickly and seamlessly incorporate LLMs into your agents and applications.

We recommend you use LangChain if you want to quickly build agents and autonomous applications. Use [LangGraph](/oss/python/langgraph/overview), our low-level agent orchestration framework and runtime, when you have more advanced needs that require a combination of deterministic and agentic workflows, heavy customization, and carefully controlled latency.

LangChain [agents](/oss/python/langchain/agents) are built on top of LangGraph in order to provide durable execution, streaming, human-in-the-loop, persistence, and more. You do not need to know LangGraph for basic LangChain agent usage.

## <Icon icon="download" size={20} /> Install

<CodeGroup>
  ```bash pip theme={null}
  pip install -U langchain
  # Requires Python 3.10+
  ```

  ```bash uv theme={null}
  uv add langchain
  # Requires Python 3.10+
  ```
</CodeGroup>

## <Icon icon="wand-magic-sparkles" /> Create an agent

```python  theme={null}
# pip install -qU "langchain[anthropic]" to call the model

from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

# Run the agent
agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]}
)
```

## <Icon icon="star" size={20} /> Core benefits

<Columns cols={2}>
  <Card title="Standard model interface" icon="arrows-rotate" href="/oss/python/langchain/models" arrow cta="Learn more">
    Different providers have unique APIs for interacting with models, including the format of responses. LangChain standardizes how you interact with models so that you can seamlessly swap providers and avoid lock-in.
  </Card>

  <Card title="Easy to use, highly flexible agent" icon="wand-magic-sparkles" href="/oss/python/langchain/agents" arrow cta="Learn more">
    LangChain's agent abstraction is designed to be easy to get started with, letting you build a simple agent in under 10 lines of code. But it also provides enough flexibility to allow you to do all the context engineering your heart desires.
  </Card>

  <Card title="Built on top of LangGraph" icon="circle-nodes" href="/oss/python/langgraph/overview" arrow cta="Learn more">
    LangChain's agents are built on top of LangGraph. This allows us to take advantage of LangGraph's durable execution, human-in-the-loop support, persistence, and more.
  </Card>

  <Card title="Debug with LangSmith" icon="eye" href="/langsmith/home" arrow cta="Learn more">
    Gain deep visibility into complex agent behavior with visualization tools that trace execution paths, capture state transitions, and provide detailed runtime metrics.
  </Card>
</Columns>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/overview.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


---------------https://docs.langchain.com/oss/python/releases/changelog---------------https://docs.langchain.com/oss/python/releases/changelog---------------https://docs.langchain.com/oss/python/releases/changelog---------------https://docs.langchain.com/oss/python/releases/changelog


# Changelog

> Log of updates and improvements to LangChain Python

<Update label="Nov 25, 2025">
  ## v1.1.0

  * [Model profiles](/oss/python/langchain/models#model-profiles): Chat models now expose supported features and capabilities through a `.profile` attribute. These data are derived from [models.dev](https://models.dev), an open source project providing model capability data.
  * [Summarization middleware](/oss/python/langchain/middleware/built-in#summarization): Updated to support flexible trigger points using model profiles for context-aware summarization.
  * [Structured output](/oss/python/langchain/structured-output): `ProviderStrategy` support (native structured output) can now be inferred from model profiles.
  * [`SystemMessage` for `create_agent`](/oss/python/langchain/middleware/custom#working-with-system-messages): Support for passing `SystemMessage` instances directly to `create_agent`'s `system_prompt` parameter, enabling advanced features like cache control and structured content blocks.
  * [Model retry middleware](/oss/python/langchain/middleware/built-in#model-retry): New middleware for automatically retrying failed model calls with configurable exponential backoff.
  * [Content moderation middleware](/oss/python/langchain/middleware/built-in#content-moderation): OpenAI content moderation middleware for detecting and handling unsafe content in agent interactions. Supports checking user input, model output, and tool results.
</Update>

<Update label="Oct 20, 2025">
  ## v1.0.0

  * [Release notes](/oss/python/releases/langchain-v1)
  * [Migration guide](/oss/python/migrate/langchain-v1)
</Update>

***

## Resources

* [Release policy](/oss/python/release-policy) – Detailed release policies
* [Versioning](/oss/python/versioning) – Understanding version numbers
* [Report issues on GitHub](https://github.com/langchain-ai/langchain/issues)

***

## Subscribe

Our changelog includes an RSS feed that can integrate with Slack, email, and other subscription tools to notify you of changes. Some options include:

* [Slack](https://slack.com/help/articles/218688467-Add-RSS-feeds-to-Slack)
  * In a Slack channel, use `/feed subscribe https://docs.langchain.com/oss/python/releases/changelog/rss.xml`
* Discord bots like [Readybot](https://readybot.io/) or [RSS Feeds to Discord Bot](https://rss.app/en/bots/rssfeeds-discord-bot)
* [Email](https://zapier.com/apps/email/integrations/rss/1441/send-new-rss-feed-entries-via-email) via Zapier

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/python/releases/changelog.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


--------------------https://docs.langchain.com/oss/python/langchain/install--------------------https://docs.langchain.com/oss/python/langchain/install--------------------https://docs.langchain.com/oss/python/langchain/install


# Install LangChain

To install the LangChain package:

<CodeGroup>
  ```bash pip theme={null}
  pip install -U langchain
  # Requires Python 3.10+
  ```

  ```bash uv theme={null}
  uv add langchain
  # Requires Python 3.10+
  ```
</CodeGroup>

LangChain provides integrations to hundreds of LLMs and thousands of other integrations. These live in independent provider packages. For example:

<CodeGroup>
  ```bash pip theme={null}
  # Installing the OpenAI integration
  pip install -U langchain-openai

  # Installing the Anthropic integration
  pip install -U langchain-anthropic
  ```

  ```bash uv theme={null}
  # Installing the OpenAI integration
  uv add langchain-openai

  # Installing the Anthropic integration
  uv add langchain-anthropic
  ```
</CodeGroup>

<Tip>
  See the [Integrations tab](/oss/python/integrations/providers/overview) for a full list of available integrations.
</Tip>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/install.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt



-----------------------------https://docs.langchain.com/oss/python/langchain/quickstart-----------------------------https://docs.langchain.com/oss/python/langchain/quickstart-----------------------------https://docs.langchain.com/oss/python/langchain/quickstart-----------------------------https://docs.langchain.com/oss/python/langchain/quickstart

# Quickstart

This quickstart takes you from a simple setup to a fully functional AI agent in just a few minutes.

## Build a basic agent

Start by creating a simple agent that can answer questions and call tools. The agent will use Claude Sonnet 4.5 as its language model, a basic weather function as a tool, and a simple prompt to guide its behavior.

<Info>
  For this example, you will need to set up a [Claude (Anthropic)](https://www.anthropic.com/) account and get an API key. Then, set the `ANTHROPIC_API_KEY` environment variable in your terminal.
</Info>

```python  theme={null}
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

# Run the agent
agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]}
)
```

<Tip>
  To learn how to trace your agent with LangSmith, see the [LangSmith documentation](/langsmith/trace-with-langchain).
</Tip>

## Build a real-world agent

Next, build a practical weather forecasting agent that demonstrates key production concepts:

1. **Detailed system prompts** for better agent behavior
2. **Create tools** that integrate with external data
3. **Model configuration** for consistent responses
4. **Structured output** for predictable results
5. **Conversational memory** for chat-like interactions
6. **Create and run the agent** create a fully functional agent

Let's walk through each step:

<Steps>
  <Step title="Define the system prompt">
    The system prompt defines your agent’s role and behavior. Keep it specific and actionable:

    ```python wrap theme={null}
    SYSTEM_PROMPT = """You are an expert weather forecaster, who speaks in puns.

    You have access to two tools:

    - get_weather_for_location: use this to get the weather for a specific location
    - get_user_location: use this to get the user's location

    If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location."""
    ```
  </Step>

  <Step title="Create tools">
    [Tools](/oss/python/langchain/tools) let a model interact with external systems by calling functions you define.
    Tools can depend on [runtime context](/oss/python/langchain/runtime) and also interact with [agent memory](/oss/python/langchain/short-term-memory).

    Notice below how the `get_user_location` tool uses runtime context:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.tools import tool, ToolRuntime

    @tool
    def get_weather_for_location(city: str) -> str:
        """Get weather for a given city."""
        return f"It's always sunny in {city}!"

    @dataclass
    class Context:
        """Custom runtime context schema."""
        user_id: str

    @tool
    def get_user_location(runtime: ToolRuntime[Context]) -> str:
        """Retrieve user information based on user ID."""
        user_id = runtime.context.user_id
        return "Florida" if user_id == "1" else "SF"
    ```

    <Tip>
      Tools should be well-documented: their name, description, and argument names become part of the model's prompt.
      LangChain's [`@tool` decorator](https://reference.langchain.com/python/langchain/tools/#langchain.tools.tool) adds metadata and enables runtime injection via the `ToolRuntime` parameter.
    </Tip>
  </Step>

  <Step title="Configure your model">
    Set up your [language model](/oss/python/langchain/models) with the right [parameters](/oss/python/langchain/models#parameters) for your use case:

    ```python  theme={null}
    from langchain.chat_models import init_chat_model

    model = init_chat_model(
        "claude-sonnet-4-5-20250929",
        temperature=0.5,
        timeout=10,
        max_tokens=1000
    )
    ```
  </Step>

  <Step title="Define response format">
    Optionally, define a structured response format if you need the agent responses to match
    a specific schema.

    ```python  theme={null}
    from dataclasses import dataclass

    # We use a dataclass here, but Pydantic models are also supported.
    @dataclass
    class ResponseFormat:
        """Response schema for the agent."""
        # A punny response (always required)
        punny_response: str
        # Any interesting information about the weather if available
        weather_conditions: str | None = None
    ```
  </Step>

  <Step title="Add memory">
    Add [memory](/oss/python/langchain/short-term-memory) to your agent to maintain state across interactions. This allows
    the agent to remember previous conversations and context.

    ```python  theme={null}
    from langgraph.checkpoint.memory import InMemorySaver

    checkpointer = InMemorySaver()
    ```

    <Info>
      In production, use a persistent checkpointer that saves to a database.
      See [Add and manage memory](/oss/python/langgraph/add-memory#manage-short-term-memory) for more details.
    </Info>
  </Step>

  <Step title="Create and run the agent">
    Now assemble your agent with all the components and run it!

    ```python  theme={null}
    agent = create_agent(
        model=model,
        system_prompt=SYSTEM_PROMPT,
        tools=[get_user_location, get_weather_for_location],
        context_schema=Context,
        response_format=ToolStrategy(ResponseFormat),
        checkpointer=checkpointer
    )

    # `thread_id` is a unique identifier for a given conversation.
    config = {"configurable": {"thread_id": "1"}}

    response = agent.invoke(
        {"messages": [{"role": "user", "content": "what is the weather outside?"}]},
        config=config,
        context=Context(user_id="1")
    )

    print(response['structured_response'])
    # ResponseFormat(
    #     punny_response="Florida is still having a 'sun-derful' day! The sunshine is playing 'ray-dio' hits all day long! I'd say it's the perfect weather for some 'solar-bration'! If you were hoping for rain, I'm afraid that idea is all 'washed up' - the forecast remains 'clear-ly' brilliant!",
    #     weather_conditions="It's always sunny in Florida!"
    # )


    # Note that we can continue the conversation using the same `thread_id`.
    response = agent.invoke(
        {"messages": [{"role": "user", "content": "thank you!"}]},
        config=config,
        context=Context(user_id="1")
    )

    print(response['structured_response'])
    # ResponseFormat(
    #     punny_response="You're 'thund-erfully' welcome! It's always a 'breeze' to help you stay 'current' with the weather. I'm just 'cloud'-ing around waiting to 'shower' you with more forecasts whenever you need them. Have a 'sun-sational' day in the Florida sunshine!",
    #     weather_conditions=None
    # )
    ```
  </Step>
</Steps>

<Expandable title="Full example code">
  ```python  theme={null}
  from dataclasses import dataclass

  from langchain.agents import create_agent
  from langchain.chat_models import init_chat_model
  from langchain.tools import tool, ToolRuntime
  from langgraph.checkpoint.memory import InMemorySaver
  from langchain.agents.structured_output import ToolStrategy


  # Define system prompt
  SYSTEM_PROMPT = """You are an expert weather forecaster, who speaks in puns.

  You have access to two tools:

  - get_weather_for_location: use this to get the weather for a specific location
  - get_user_location: use this to get the user's location

  If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location."""

  # Define context schema
  @dataclass
  class Context:
      """Custom runtime context schema."""
      user_id: str

  # Define tools
  @tool
  def get_weather_for_location(city: str) -> str:
      """Get weather for a given city."""
      return f"It's always sunny in {city}!"

  @tool
  def get_user_location(runtime: ToolRuntime[Context]) -> str:
      """Retrieve user information based on user ID."""
      user_id = runtime.context.user_id
      return "Florida" if user_id == "1" else "SF"

  # Configure model
  model = init_chat_model(
      "claude-sonnet-4-5-20250929",
      temperature=0
  )

  # Define response format
  @dataclass
  class ResponseFormat:
      """Response schema for the agent."""
      # A punny response (always required)
      punny_response: str
      # Any interesting information about the weather if available
      weather_conditions: str | None = None

  # Set up memory
  checkpointer = InMemorySaver()

  # Create agent
  agent = create_agent(
      model=model,
      system_prompt=SYSTEM_PROMPT,
      tools=[get_user_location, get_weather_for_location],
      context_schema=Context,
      response_format=ToolStrategy(ResponseFormat),
      checkpointer=checkpointer
  )

  # Run agent
  # `thread_id` is a unique identifier for a given conversation.
  config = {"configurable": {"thread_id": "1"}}

  response = agent.invoke(
      {"messages": [{"role": "user", "content": "what is the weather outside?"}]},
      config=config,
      context=Context(user_id="1")
  )

  print(response['structured_response'])
  # ResponseFormat(
  #     punny_response="Florida is still having a 'sun-derful' day! The sunshine is playing 'ray-dio' hits all day long! I'd say it's the perfect weather for some 'solar-bration'! If you were hoping for rain, I'm afraid that idea is all 'washed up' - the forecast remains 'clear-ly' brilliant!",
  #     weather_conditions="It's always sunny in Florida!"
  # )


  # Note that we can continue the conversation using the same `thread_id`.
  response = agent.invoke(
      {"messages": [{"role": "user", "content": "thank you!"}]},
      config=config,
      context=Context(user_id="1")
  )

  print(response['structured_response'])
  # ResponseFormat(
  #     punny_response="You're 'thund-erfully' welcome! It's always a 'breeze' to help you stay 'current' with the weather. I'm just 'cloud'-ing around waiting to 'shower' you with more forecasts whenever you need them. Have a 'sun-sational' day in the Florida sunshine!",
  #     weather_conditions=None
  # )
  ```
</Expandable>

<Tip>
  To learn how to trace your agent with LangSmith, see the [LangSmith documentation](/langsmith/trace-with-langchain).
</Tip>

Congratulations! You now have an AI agent that can:

* **Understand context** and remember conversations
* **Use multiple tools** intelligently
* **Provide structured responses** in a consistent format
* **Handle user-specific information** through context
* **Maintain conversation state** across interactions

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/quickstart.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt




----------------------------https://docs.langchain.com/oss/python/langchain/philosophy----------------------------https://docs.langchain.com/oss/python/langchain/philosophy----------------------------https://docs.langchain.com/oss/python/langchain/philosophy----------------------------https://docs.langchain.com/oss/python/langchain/philosophy----------------------------https://docs.langchain.com/oss/python/langchain/philosophy


# Philosophy

> LangChain exists to be the easiest place to start building with LLMs, while also being flexible and production-ready.

LangChain is driven by a few core beliefs:

* Large Language Models (LLMs) are great, powerful new technology.
* LLMs are even better when you combine them with external sources of data.
* LLMs will transform what the applications of the future look like. Specifically, the applications of the future will look more and more agentic.
* It is still very early on in that transformation.
* While it's easy to build a prototype of those agentic applications, it's still really hard to build agents that are reliable enough to put into production.

With LangChain, we have two core focuses:

<Steps>
  <Step title="We want to enable developers to build with the best models.">
    Different providers expose different APIs, with different model parameters and different message formats.
    Standardizing these model inputs and outputs is a core focus, making it easy for developer to easily change to the most recent state-of-the-art model, avoiding lock-in.
  </Step>

  <Step title="We want to make it easy to use models to orchestrate more complex flows that interact with other data and computation.">
    Models should be used for more than just *text generation* - they should also be used to orchestrate more complex flows that interact with other data. LangChain makes it easy to define [tools](/oss/python/langchain/tools) that LLMs can use dynamically, as well as help with parsing of and access to unstructured data.
  </Step>
</Steps>

## History

Given the constant rate of change in the field, LangChain has also evolved over time. Below is a brief timeline of how LangChain has changed over the years, evolving alongside what it means to build with LLMs:

<Update label="2022-10-24" description="v0.0.1">
  A month before ChatGPT, **LangChain was launched as a Python package**. It consisted of two main components:

  * LLM abstractions
  * "Chains", or predetermined steps of computation to run, for common use cases. For example - RAG: run a retrieval step, then run a generation step.

  The name LangChain comes from "Language" (like Language models) and "Chains".
</Update>

<Update label="2022-12">
  The first general purpose agents were added to LangChain.

  These general purpose agents were based on the [ReAct paper](https://arxiv.org/abs/2210.03629) (ReAct standing for Reasoning and Acting). They used LLMs to generate JSON that represented tool calls, and then parsed that JSON to determine what tools to call.
</Update>

<Update label="2023-01">
  OpenAI releases a 'Chat Completion' API.

  Previously, models took in strings and returned a string. In the ChatCompletions API, they evolved to take in a list of messages and return a message. Other model providers followed suit, and LangChain updated to work with lists of messages.
</Update>

<Update label="2023-01">
  LangChain releases a JavaScript version.

  LLMs and agents will change how applications are built and JavaScript is the language of application developers.
</Update>

<Update label="2023-02">
  **LangChain Inc. was formed as a company** around the open source LangChain project.

  The main goal was to "make intelligent agents ubiquitous". The team recognized that while LangChain was a key part (LangChain made it simple to get started with LLMs), there was also a need for other components.
</Update>

<Update label="2023-03">
  OpenAI releases 'function calling' in their API.

  This allowed the API to explicitly generate payloads that represented tool calls. Other model providers followed suit, and LangChain was updated to use this as the preferred method for tool calling (rather than parsing JSON).
</Update>

<Update label="2023-06">
  **LangSmith is released** as closed source platform by LangChain Inc., providing observability and evals

  The main issue with building agents is getting them to be reliable, and LangSmith, which provides observability and evals, was built to solve that need. LangChain was updated to integrate seamlessly with LangSmith.
</Update>

<Update label="2024-01" description="v0.1.0">
  **LangChain releases 0.1.0**, its first non-0.0.x.

  The industry matured from prototypes to production, and as such, LangChain increased its focus on stability.
</Update>

<Update label="2024-02">
  **LangGraph is released** as an open-source library.

  The original LangChain had two focuses: LLM abstractions, and high-level interfaces for getting started with common applications; however, it was missing a low-level orchestration layer that allowed developers to control the exact flow of their agent. Enter: LangGraph.

  When building LangGraph, we learned from lessons when building LangChain and added functionality we discovered was needed: streaming, durable execution, short-term memory, human-in-the-loop, and more.
</Update>

<Update label="2024-06">
  **LangChain has over 700 integrations.**

  Integrations were split out of the core LangChain package, and either moved into their own standalone packages (for the core integrations) or `langchain-community`.
</Update>

<Update label="2024-10">
  LangGraph becomes the preferred way to build any AI application that is more than a single LLM call.

  As developers tried to improve the reliability of their applications, they needed more control than the high-level interfaces provided. LangGraph provided that low-level flexibility. Most chains and agents were marked as deprecated in LangChain with guides on how to migrate them to LangGraph. There is still one high-level abstraction created in LangGraph: an agent abstraction. It is built on top of low-level LangGraph and has the same interface as the ReAct agents from LangChain.
</Update>

<Update label="2025-04">
  Model APIs become more multimodal.

  Models started to accept files, images, videos, and more. We updated the `langchain-core` message format accordingly to allow developers to specify these multimodal inputs in a standard way.
</Update>

<Update label="2025-10-20" description="v1.0.0">
  **LangChain releases 1.0** with two major changes:

  1. Complete revamp of all chains and agents in `langchain`. All chains and agents are now replaced with only one high level abstraction: an agent abstraction built on top of LangGraph. This was the high-level abstraction that was originally created in LangGraph, but just moved to LangChain.

     For users still using old LangChain chains/agents who do NOT want to upgrade (note: we recommend you do), you can continue using old LangChain by installing the `langchain-classic` package.

  2. A standard message content format: Model APIs evolved from returning messages with a simple content string to more complex output types - reasoning blocks, citations, server-side tool calls, etc. LangChain evolved its message formats to standardize these across providers.
</Update>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/philosophy.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


------------------------------------https://docs.langchain.com/oss/python/langchain/agents------------------------------------https://docs.langchain.com/oss/python/langchain/agents------------------------------------https://docs.langchain.com/oss/python/langchain/agents------------------------------------https://docs.langchain.com/oss/python/langchain/agents------------------------------------https://docs.langchain.com/oss/python/langchain/agents

# Agents

Agents combine language models with [tools](/oss/python/langchain/tools) to create systems that can reason about tasks, decide which tools to use, and iteratively work towards solutions.

[`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) provides a production-ready agent implementation.

[An LLM Agent runs tools in a loop to achieve a goal](https://simonwillison.net/2025/Sep/18/agents/).
An agent runs until a stop condition is met - i.e., when the model emits a final output or an iteration limit is reached.

```mermaid  theme={null}
%%{
  init: {
    "fontFamily": "monospace",
    "flowchart": {
      "curve": "curve"
    },
    "themeVariables": {"edgeLabelBackground": "transparent"}
  }
}%%
graph TD
  %% Outside the agent
  QUERY([input])
  LLM{model}
  TOOL(tools)
  ANSWER([output])

  %% Main flows (no inline labels)
  QUERY --> LLM
  LLM --"action"--> TOOL
  TOOL --"observation"--> LLM
  LLM --"finish"--> ANSWER

  classDef blueHighlight fill:#0a1c25,stroke:#0a455f,color:#bae6fd;
  classDef greenHighlight fill:#0b1e1a,stroke:#0c4c39,color:#9ce4c4;
  class QUERY blueHighlight;
  class ANSWER blueHighlight;
```

<Info>
  [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) builds a **graph**-based agent runtime using [LangGraph](/oss/python/langgraph/overview). A graph consists of nodes (steps) and edges (connections) that define how your agent processes information. The agent moves through this graph, executing nodes like the model node (which calls the model), the tools node (which executes tools), or middleware.

  Learn more about the [Graph API](/oss/python/langgraph/graph-api).
</Info>

## Core components

### Model

The [model](/oss/python/langchain/models) is the reasoning engine of your agent. It can be specified in multiple ways, supporting both static and dynamic model selection.

#### Static model

Static models are configured once when creating the agent and remain unchanged throughout execution. This is the most common and straightforward approach.

To initialize a static model from a <Tooltip tip="A string that follows the format `provider:model` (e.g. openai:gpt-5)" cta="See mappings" href="https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model(model)">model identifier string</Tooltip>:

```python wrap theme={null}
from langchain.agents import create_agent

agent = create_agent(
    "gpt-5",
    tools=tools
)
```

<Tip>
  Model identifier strings support automatic inference (e.g., `"gpt-5"` will be inferred as `"openai:gpt-5"`). Refer to the [reference](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model\(model\)) to see a full list of model identifier string mappings.
</Tip>

For more control over the model configuration, initialize a model instance directly using the provider package. In this example, we use [`ChatOpenAI`](https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI). See [Chat models](/oss/python/integrations/chat) for other available chat model classes.

```python wrap theme={null}
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

model = ChatOpenAI(
    model="gpt-5",
    temperature=0.1,
    max_tokens=1000,
    timeout=30
    # ... (other params)
)
agent = create_agent(model, tools=tools)
```

Model instances give you complete control over configuration. Use them when you need to set specific [parameters](/oss/python/langchain/models#parameters) like `temperature`, `max_tokens`, `timeouts`, `base_url`, and other provider-specific settings. Refer to the [reference](/oss/python/integrations/providers/all_providers) to see available params and methods on your model.

#### Dynamic model

Dynamic models are selected at <Tooltip tip="The execution environment of your agent, containing immutable configuration and contextual data that persists throughout the agent's execution (e.g., user IDs, session details, or application-specific configuration).">runtime</Tooltip> based on the current <Tooltip tip="The data that flows through your agent's execution, including messages, custom fields, and any information that needs to be tracked and potentially modified during processing (e.g., user preferences or tool usage stats).">state</Tooltip> and context. This enables sophisticated routing logic and cost optimization.

To use a dynamic model, create middleware using the [`@wrap_model_call`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.wrap_model_call) decorator that modifies the model in the request:

```python  theme={null}
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse


basic_model = ChatOpenAI(model="gpt-4o-mini")
advanced_model = ChatOpenAI(model="gpt-4o")

@wrap_model_call
def dynamic_model_selection(request: ModelRequest, handler) -> ModelResponse:
    """Choose model based on conversation complexity."""
    message_count = len(request.state["messages"])

    if message_count > 10:
        # Use an advanced model for longer conversations
        model = advanced_model
    else:
        model = basic_model

    return handler(request.override(model=model))

agent = create_agent(
    model=basic_model,  # Default model
    tools=tools,
    middleware=[dynamic_model_selection]
)
```

<Warning>
  Pre-bound models (models with [`bind_tools`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.bind_tools) already called) are not supported when using structured output. If you need dynamic model selection with structured output, ensure the models passed to the middleware are not pre-bound.
</Warning>

<Tip>
  For model configuration details, see [Models](/oss/python/langchain/models). For dynamic model selection patterns, see [Dynamic model in middleware](/oss/python/langchain/middleware#dynamic-model).
</Tip>

### Tools

Tools give agents the ability to take actions. Agents go beyond simple model-only tool binding by facilitating:

* Multiple tool calls in sequence (triggered by a single prompt)
* Parallel tool calls when appropriate
* Dynamic tool selection based on previous results
* Tool retry logic and error handling
* State persistence across tool calls

For more information, see [Tools](/oss/python/langchain/tools).

#### Defining tools

Pass a list of tools to the agent.

<Tip>
  Tools can be specified as plain Python functions or <Tooltip tip="A method that can suspend execution and resume at a later time">coroutines</Tooltip>.

  The [tool decorator](/oss/python/langchain/tools#create-tools) can be used to customize tool names, descriptions, argument schemas, and other properties.
</Tip>

```python wrap theme={null}
from langchain.tools import tool
from langchain.agents import create_agent


@tool
def search(query: str) -> str:
    """Search for information."""
    return f"Results for: {query}"

@tool
def get_weather(location: str) -> str:
    """Get weather information for a location."""
    return f"Weather in {location}: Sunny, 72°F"

agent = create_agent(model, tools=[search, get_weather])
```

If an empty tool list is provided, the agent will consist of a single LLM node without tool-calling capabilities.

#### Tool error handling

To customize how tool errors are handled, use the [`@wrap_tool_call`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.wrap_tool_call) decorator to create middleware:

```python wrap theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import wrap_tool_call
from langchain.messages import ToolMessage


@wrap_tool_call
def handle_tool_errors(request, handler):
    """Handle tool execution errors with custom messages."""
    try:
        return handler(request)
    except Exception as e:
        # Return a custom error message to the model
        return ToolMessage(
            content=f"Tool error: Please check your input and try again. ({str(e)})",
            tool_call_id=request.tool_call["id"]
        )

agent = create_agent(
    model="gpt-4o",
    tools=[search, get_weather],
    middleware=[handle_tool_errors]
)
```

The agent will return a [`ToolMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage) with the custom error message when a tool fails:

```python  theme={null}
[
    ...
    ToolMessage(
        content="Tool error: Please check your input and try again. (division by zero)",
        tool_call_id="..."
    ),
    ...
]
```

#### Tool use in the ReAct loop

Agents follow the ReAct ("Reasoning + Acting") pattern, alternating between brief reasoning steps with targeted tool calls and feeding the resulting observations into subsequent decisions until they can deliver a final answer.

<Accordion title="Example of ReAct loop">
  **Prompt:** Identify the current most popular wireless headphones and verify availability.

  ```
  ================================ Human Message =================================

  Find the most popular wireless headphones right now and check if they're in stock
  ```

  * **Reasoning**: "Popularity is time-sensitive, I need to use the provided search tool."
  * **Acting**: Call `search_products("wireless headphones")`

  ```
  ================================== Ai Message ==================================
  Tool Calls:
    search_products (call_abc123)
   Call ID: call_abc123
    Args:
      query: wireless headphones
  ```

  ```
  ================================= Tool Message =================================

  Found 5 products matching "wireless headphones". Top 5 results: WH-1000XM5, ...
  ```

  * **Reasoning**: "I need to confirm availability for the top-ranked item before answering."
  * **Acting**: Call `check_inventory("WH-1000XM5")`

  ```
  ================================== Ai Message ==================================
  Tool Calls:
    check_inventory (call_def456)
   Call ID: call_def456
    Args:
      product_id: WH-1000XM5
  ```

  ```
  ================================= Tool Message =================================

  Product WH-1000XM5: 10 units in stock
  ```

  * **Reasoning**: "I have the most popular model and its stock status. I can now answer the user's question."
  * **Acting**: Produce final answer

  ```
  ================================== Ai Message ==================================

  I found wireless headphones (model WH-1000XM5) with 10 units in stock...
  ```
</Accordion>

<Tip>
  To learn more about tools, see [Tools](/oss/python/langchain/tools).
</Tip>

### System prompt

You can shape how your agent approaches tasks by providing a prompt. The [`system_prompt`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(system_prompt\)) parameter can be provided as a string:

```python wrap theme={null}
agent = create_agent(
    model,
    tools,
    system_prompt="You are a helpful assistant. Be concise and accurate."
)
```

When no [`system_prompt`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(system_prompt\)) is provided, the agent will infer its task from the messages directly.

#### Dynamic system prompt

For more advanced use cases where you need to modify the system prompt based on runtime context or agent state, you can use [middleware](/oss/python/langchain/middleware).

The [`@dynamic_prompt`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.dynamic_prompt) decorator creates middleware that generates system prompts based on the model request:

```python wrap theme={null}
from typing import TypedDict

from langchain.agents import create_agent
from langchain.agents.middleware import dynamic_prompt, ModelRequest


class Context(TypedDict):
    user_role: str

@dynamic_prompt
def user_role_prompt(request: ModelRequest) -> str:
    """Generate system prompt based on user role."""
    user_role = request.runtime.context.get("user_role", "user")
    base_prompt = "You are a helpful assistant."

    if user_role == "expert":
        return f"{base_prompt} Provide detailed technical responses."
    elif user_role == "beginner":
        return f"{base_prompt} Explain concepts simply and avoid jargon."

    return base_prompt

agent = create_agent(
    model="gpt-4o",
    tools=[web_search],
    middleware=[user_role_prompt],
    context_schema=Context
)

# The system prompt will be set dynamically based on context
result = agent.invoke(
    {"messages": [{"role": "user", "content": "Explain machine learning"}]},
    context={"user_role": "expert"}
)
```

<Tip>
  For more details on message types and formatting, see [Messages](/oss/python/langchain/messages). For comprehensive middleware documentation, see [Middleware](/oss/python/langchain/middleware).
</Tip>

## Invocation

You can invoke an agent by passing an update to its [`State`](/oss/python/langgraph/graph-api#state). All agents include a [sequence of messages](/oss/python/langgraph/use-graph-api#messagesstate) in their state; to invoke the agent, pass a new message:

```python  theme={null}
result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's the weather in San Francisco?"}]}
)
```

For streaming steps and / or tokens from the agent, refer to the [streaming](/oss/python/langchain/streaming) guide.

Otherwise, the agent follows the LangGraph [Graph API](/oss/python/langgraph/use-graph-api) and supports all associated methods, such as `stream` and `invoke`.

## Advanced concepts

### Structured output

In some situations, you may want the agent to return an output in a specific format. LangChain provides strategies for structured output via the `response_format` parameter.

#### ToolStrategy

`ToolStrategy` uses artificial tool calling to generate structured output. This works with any model that supports tool calling:

```python wrap theme={null}
from pydantic import BaseModel
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy


class ContactInfo(BaseModel):
    name: str
    email: str
    phone: str

agent = create_agent(
    model="gpt-4o-mini",
    tools=[search_tool],
    response_format=ToolStrategy(ContactInfo)
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "Extract contact info from: John Doe, john@example.com, (555) 123-4567"}]
})

result["structured_response"]
# ContactInfo(name='John Doe', email='john@example.com', phone='(555) 123-4567')
```

#### ProviderStrategy

`ProviderStrategy` uses the model provider's native structured output generation. This is more reliable but only works with providers that support native structured output (e.g., OpenAI):

```python wrap theme={null}
from langchain.agents.structured_output import ProviderStrategy

agent = create_agent(
    model="gpt-4o",
    response_format=ProviderStrategy(ContactInfo)
)
```

<Note>
  As of `langchain 1.0`, simply passing a schema (e.g., `response_format=ContactInfo`) is no longer supported. You must explicitly use `ToolStrategy` or `ProviderStrategy`.
</Note>

<Tip>
  To learn about structured output, see [Structured output](/oss/python/langchain/structured-output).
</Tip>

### Memory

Agents maintain conversation history automatically through the message state. You can also configure the agent to use a custom state schema to remember additional information during the conversation.

Information stored in the state can be thought of as the [short-term memory](/oss/python/langchain/short-term-memory) of the agent:

Custom state schemas must extend [`AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState) as a `TypedDict`.

There are two ways to define custom state:

1. Via [middleware](/oss/python/langchain/middleware) (preferred)
2. Via [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) on [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent)

#### Defining state via middleware

Use middleware to define custom state when your custom state needs to be accessed by specific middleware hooks and tools attached to said middleware.

```python  theme={null}
from langchain.agents import AgentState
from langchain.agents.middleware import AgentMiddleware
from typing import Any


class CustomState(AgentState):
    user_preferences: dict

class CustomMiddleware(AgentMiddleware):
    state_schema = CustomState
    tools = [tool1, tool2]

    def before_model(self, state: CustomState, runtime) -> dict[str, Any] | None:
        ...

agent = create_agent(
    model,
    tools=tools,
    middleware=[CustomMiddleware()]
)

# The agent can now track additional state beyond messages
result = agent.invoke({
    "messages": [{"role": "user", "content": "I prefer technical explanations"}],
    "user_preferences": {"style": "technical", "verbosity": "detailed"},
})
```

#### Defining state via `state_schema`

Use the [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) parameter as a shortcut to define custom state that is only used in tools.

```python  theme={null}
from langchain.agents import AgentState


class CustomState(AgentState):
    user_preferences: dict

agent = create_agent(
    model,
    tools=[tool1, tool2],
    state_schema=CustomState
)
# The agent can now track additional state beyond messages
result = agent.invoke({
    "messages": [{"role": "user", "content": "I prefer technical explanations"}],
    "user_preferences": {"style": "technical", "verbosity": "detailed"},
})
```

<Note>
  As of `langchain 1.0`, custom state schemas **must** be `TypedDict` types. Pydantic models and dataclasses are no longer supported. See the [v1 migration guide](/oss/python/migrate/langchain-v1#state-type-restrictions) for more details.
</Note>

<Note>
  Defining custom state via middleware is preferred over defining it via [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) on [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) because it allows you to keep state extensions conceptually scoped to the relevant middleware and tools.

  [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) is still supported for backwards compatibility on [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent).
</Note>

<Tip>
  To learn more about memory, see [Memory](/oss/python/concepts/memory). For information on implementing long-term memory that persists across sessions, see [Long-term memory](/oss/python/langchain/long-term-memory).
</Tip>

### Streaming

We've seen how the agent can be called with `invoke` to get a final response. If the agent executes multiple steps, this may take a while. To show intermediate progress, we can stream back messages as they occur.

```python  theme={null}
for chunk in agent.stream({
    "messages": [{"role": "user", "content": "Search for AI news and summarize the findings"}]
}, stream_mode="values"):
    # Each chunk contains the full state at that point
    latest_message = chunk["messages"][-1]
    if latest_message.content:
        print(f"Agent: {latest_message.content}")
    elif latest_message.tool_calls:
        print(f"Calling tools: {[tc['name'] for tc in latest_message.tool_calls]}")
```

<Tip>
  For more details on streaming, see [Streaming](/oss/python/langchain/streaming).
</Tip>

### Middleware

[Middleware](/oss/python/langchain/middleware) provides powerful extensibility for customizing agent behavior at different stages of execution. You can use middleware to:

* Process state before the model is called (e.g., message trimming, context injection)
* Modify or validate the model's response (e.g., guardrails, content filtering)
* Handle tool execution errors with custom logic
* Implement dynamic model selection based on state or context
* Add custom logging, monitoring, or analytics

Middleware integrates seamlessly into the agent's execution, allowing you to intercept and modify data flow at key points without changing the core agent logic.

<Tip>
  For comprehensive middleware documentation including decorators like [`@before_model`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.before_model), [`@after_model`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.after_model), and [`@wrap_tool_call`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.wrap_tool_call), see [Middleware](/oss/python/langchain/middleware).
</Tip>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/agents.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt

-----------------------https://docs.langchain.com/oss/python/langchain/models-----------------------https://docs.langchain.com/oss/python/langchain/models-----------------------https://docs.langchain.com/oss/python/langchain/models-----------------------https://docs.langchain.com/oss/python/langchain/models


# Models

[LLMs](https://en.wikipedia.org/wiki/Large_language_model) are powerful AI tools that can interpret and generate text like humans. They're versatile enough to write content, translate languages, summarize, and answer questions without needing specialized training for each task.

In addition to text generation, many models support:

* <Icon icon="hammer" size={16} /> [Tool calling](#tool-calling) - calling external tools (like databases queries or API calls) and use results in their responses.
* <Icon icon="shapes" size={16} /> [Structured output](#structured-output) - where the model's response is constrained to follow a defined format.
* <Icon icon="image" size={16} /> [Multimodality](#multimodal) - process and return data other than text, such as images, audio, and video.
* <Icon icon="brain" size={16} /> [Reasoning](#reasoning) - models perform multi-step reasoning to arrive at a conclusion.

Models are the reasoning engine of [agents](/oss/python/langchain/agents). They drive the agent's decision-making process, determining which tools to call, how to interpret results, and when to provide a final answer.

The quality and capabilities of the model you choose directly impact your agent's baseline reliability and performance. Different models excel at different tasks - some are better at following complex instructions, others at structured reasoning, and some support larger context windows for handling more information.

LangChain's standard model interfaces give you access to many different provider integrations, which makes it easy to experiment with and switch between models to find the best fit for your use case.

<Info>
  For provider-specific integration information and capabilities, see the provider's [chat model page](/oss/python/integrations/chat).
</Info>

## Basic usage

Models can be utilized in two ways:

1. **With agents** - Models can be dynamically specified when creating an [agent](/oss/python/langchain/agents#model).
2. **Standalone** - Models can be called directly (outside of the agent loop) for tasks like text generation, classification, or extraction without the need for an agent framework.

The same model interface works in both contexts, which gives you the flexibility to start simple and scale up to more complex agent-based workflows as needed.

### Initialize a model

The easiest way to get started with a standalone model in LangChain is to use [`init_chat_model`](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model) to initialize one from a [chat model provider](/oss/python/integrations/chat) of your choice (examples below):

<Tabs>
  <Tab title="OpenAI">
    👉 Read the [OpenAI chat model integration docs](/oss/python/integrations/chat/openai/)

    ```shell theme={null} theme={null}
    pip install -U "langchain[openai]"
    ```

    <CodeGroup>
      ```python init_chat_model theme={null} theme={null}
      import os
      from langchain.chat_models import init_chat_model

      os.environ["OPENAI_API_KEY"] = "sk-..."

      model = init_chat_model("gpt-4.1")
      ```

      ```python Model Class theme={null} theme={null}
      import os
      from langchain_openai import ChatOpenAI

      os.environ["OPENAI_API_KEY"] = "sk-..."

      model = ChatOpenAI(model="gpt-4.1")
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Anthropic">
    👉 Read the [Anthropic chat model integration docs](/oss/python/integrations/chat/anthropic/)

    ```shell theme={null} theme={null}
    pip install -U "langchain[anthropic]"
    ```

    <CodeGroup>
      ```python init_chat_model theme={null} theme={null}
      import os
      from langchain.chat_models import init_chat_model

      os.environ["ANTHROPIC_API_KEY"] = "sk-..."

      model = init_chat_model("claude-sonnet-4-5-20250929")
      ```

      ```python Model Class theme={null} theme={null}
      import os
      from langchain_anthropic import ChatAnthropic

      os.environ["ANTHROPIC_API_KEY"] = "sk-..."

      model = ChatAnthropic(model="claude-sonnet-4-5-20250929")
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Azure">
    👉 Read the [Azure chat model integration docs](/oss/python/integrations/chat/azure_chat_openai/)

    ```shell theme={null} theme={null}
    pip install -U "langchain[openai]"
    ```

    <CodeGroup>
      ```python init_chat_model theme={null} theme={null}
      import os
      from langchain.chat_models import init_chat_model

      os.environ["AZURE_OPENAI_API_KEY"] = "..."
      os.environ["AZURE_OPENAI_ENDPOINT"] = "..."
      os.environ["OPENAI_API_VERSION"] = "2025-03-01-preview"

      model = init_chat_model(
          "azure_openai:gpt-4.1",
          azure_deployment=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"],
      )
      ```

      ```python Model Class theme={null} theme={null}
      import os
      from langchain_openai import AzureChatOpenAI

      os.environ["AZURE_OPENAI_API_KEY"] = "..."
      os.environ["AZURE_OPENAI_ENDPOINT"] = "..."
      os.environ["OPENAI_API_VERSION"] = "2025-03-01-preview"

      model = AzureChatOpenAI(
          model="gpt-4.1",
          azure_deployment=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"]
      )
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Google Gemini">
    👉 Read the [Google GenAI chat model integration docs](/oss/python/integrations/chat/google_generative_ai/)

    ```shell theme={null} theme={null}
    pip install -U "langchain[google-genai]"
    ```

    <CodeGroup>
      ```python init_chat_model theme={null} theme={null}
      import os
      from langchain.chat_models import init_chat_model

      os.environ["GOOGLE_API_KEY"] = "..."

      model = init_chat_model("google_genai:gemini-2.5-flash-lite")
      ```

      ```python Model Class theme={null} theme={null}
      import os
      from langchain_google_genai import ChatGoogleGenerativeAI

      os.environ["GOOGLE_API_KEY"] = "..."

      model = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")
      ```
    </CodeGroup>
  </Tab>

  <Tab title="AWS Bedrock">
    👉 Read the [AWS Bedrock chat model integration docs](/oss/python/integrations/chat/bedrock/)

    ```shell theme={null} theme={null}
    pip install -U "langchain[aws]"
    ```

    <CodeGroup>
      ```python init_chat_model theme={null} theme={null}
      from langchain.chat_models import init_chat_model

      # Follow the steps here to configure your credentials:
      # https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html

      model = init_chat_model(
          "anthropic.claude-3-5-sonnet-20240620-v1:0",
          model_provider="bedrock_converse",
      )
      ```

      ```python Model Class theme={null} theme={null}
      from langchain_aws import ChatBedrock

      model = ChatBedrock(model="anthropic.claude-3-5-sonnet-20240620-v1:0")
      ```
    </CodeGroup>

    <Tab title="HuggingFace">
      👉 Read the [HuggingFace chat model integration docs](/oss/python/integrations/chat/huggingface/)

      ```shell theme={null} theme={null}
      pip install -U "langchain[huggingface]"
      ```

      <CodeGroup>
        ```python init_chat_model theme={null} theme={null}
        import os
        from langchain.chat_models import init_chat_model

        os.environ["HUGGINGFACEHUB_API_TOKEN"] = "hf_..."

        model = init_chat_model(
            "microsoft/Phi-3-mini-4k-instruct",
            model_provider="huggingface",
            temperature=0.7,
            max_tokens=1024,
        )
        ```

        ```python Model Class theme={null} theme={null}
        import os
        from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

        os.environ["HUGGINGFACEHUB_API_TOKEN"] = "hf_..."

        llm = HuggingFaceEndpoint(
            repo_id="microsoft/Phi-3-mini-4k-instruct",
            temperature=0.7,
            max_length=1024,
        )
        model = ChatHuggingFace(llm=llm)
        ```
      </CodeGroup>
    </Tab>
  </Tab>
</Tabs>

```python  theme={null}
response = model.invoke("Why do parrots talk?")
```

See [`init_chat_model`](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model) for more detail, including information on how to pass model [parameters](#parameters).

### Key methods

<Card title="Invoke" href="#invoke" icon="paper-plane" arrow="true" horizontal>
  The model takes messages as input and outputs messages after generating a complete response.
</Card>

<Card title="Stream" href="#stream" icon="tower-broadcast" arrow="true" horizontal>
  Invoke the model, but stream the output as it is generated in real-time.
</Card>

<Card title="Batch" href="#batch" icon="grip" arrow="true" horizontal>
  Send multiple requests to a model in a batch for more efficient processing.
</Card>

<Info>
  In addition to chat models, LangChain provides support for other adjacent technologies, such as embedding models and vector stores. See the [integrations page](/oss/python/integrations/providers/overview) for details.
</Info>

## Parameters

A chat model takes parameters that can be used to configure its behavior. The full set of supported parameters varies by model and provider, but standard ones include:

<ParamField body="model" type="string" required>
  The name or identifier of the specific model you want to use with a provider. You can also specify both the model and its provider in a single argument using the '{model_provider}:{model}' format, for example, 'openai:o1'.
</ParamField>

<ParamField body="api_key" type="string">
  The key required for authenticating with the model's provider. This is usually issued when you sign up for access to the model. Often accessed by setting an <Tooltip tip="A variable whose value is set outside the program, typically through functionality built into the operating system or microservice.">environment variable</Tooltip>.
</ParamField>

<ParamField body="temperature" type="number">
  Controls the randomness of the model's output. A higher number makes responses more creative; lower ones make them more deterministic.
</ParamField>

<ParamField body="max_tokens" type="number">
  Limits the total number of <Tooltip tip="The basic unit that a model reads and generates. Providers may define them differently, but in general, they can represent a whole or part of word.">tokens</Tooltip> in the response, effectively controlling how long the output can be.
</ParamField>

<ParamField body="timeout" type="number">
  The maximum time (in seconds) to wait for a response from the model before canceling the request.
</ParamField>

<ParamField body="max_retries" type="number">
  The maximum number of attempts the system will make to resend a request if it fails due to issues like network timeouts or rate limits.
</ParamField>

Using [`init_chat_model`](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model), pass these parameters as inline <Tooltip tip="Arbitrary keyword arguments" cta="Learn more" href="https://www.w3schools.com/python/python_args_kwargs.asp">`**kwargs`</Tooltip>:

```python Initialize using model parameters theme={null}
model = init_chat_model(
    "claude-sonnet-4-5-20250929",
    # Kwargs passed to the model:
    temperature=0.7,
    timeout=30,
    max_tokens=1000,
)
```

<Info>
  Each chat model integration may have additional params used to control provider-specific functionality.

  For example, [`ChatOpenAI`](https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI) has `use_responses_api` to dictate whether to use the OpenAI Responses or Completions API.

  To find all the parameters supported by a given chat model, head to the [chat model integrations](/oss/python/integrations/chat) page.
</Info>

***

## Invocation

A chat model must be invoked to generate an output. There are three primary invocation methods, each suited to different use cases.

### Invoke

The most straightforward way to call a model is to use [`invoke()`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.invoke) with a single message or a list of messages.

```python Single message theme={null}
response = model.invoke("Why do parrots have colorful feathers?")
print(response)
```

A list of messages can be provided to a chat model to represent conversation history. Each message has a role that models use to indicate who sent the message in the conversation.

See the [messages](/oss/python/langchain/messages) guide for more detail on roles, types, and content.

```python Dictionary format theme={null}
conversation = [
    {"role": "system", "content": "You are a helpful assistant that translates English to French."},
    {"role": "user", "content": "Translate: I love programming."},
    {"role": "assistant", "content": "J'adore la programmation."},
    {"role": "user", "content": "Translate: I love building applications."}
]

response = model.invoke(conversation)
print(response)  # AIMessage("J'adore créer des applications.")
```

```python Message objects theme={null}
from langchain.messages import HumanMessage, AIMessage, SystemMessage

conversation = [
    SystemMessage("You are a helpful assistant that translates English to French."),
    HumanMessage("Translate: I love programming."),
    AIMessage("J'adore la programmation."),
    HumanMessage("Translate: I love building applications.")
]

response = model.invoke(conversation)
print(response)  # AIMessage("J'adore créer des applications.")
```

<Info>
  If the return type of your invocation is a string, ensure that you are using a chat model as opposed to a LLM. Legacy, text-completion LLMs return strings directly. LangChain chat models are prefixed with "Chat", e.g., [`ChatOpenAI`](https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI)(/oss/integrations/chat/openai).
</Info>

### Stream

Most models can stream their output content while it is being generated. By displaying output progressively, streaming significantly improves user experience, particularly for longer responses.

Calling [`stream()`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.stream) returns an <Tooltip tip="An object that progressively provides access to each item of a collection, in order.">iterator</Tooltip> that yields output chunks as they are produced. You can use a loop to process each chunk in real-time:

<CodeGroup>
  ```python Basic text streaming theme={null}
  for chunk in model.stream("Why do parrots have colorful feathers?"):
      print(chunk.text, end="|", flush=True)
  ```

  ```python Stream tool calls, reasoning, and other content theme={null}
  for chunk in model.stream("What color is the sky?"):
      for block in chunk.content_blocks:
          if block["type"] == "reasoning" and (reasoning := block.get("reasoning")):
              print(f"Reasoning: {reasoning}")
          elif block["type"] == "tool_call_chunk":
              print(f"Tool call chunk: {block}")
          elif block["type"] == "text":
              print(block["text"])
          else:
              ...
  ```
</CodeGroup>

As opposed to [`invoke()`](#invoke), which returns a single [`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage) after the model has finished generating its full response, `stream()` returns multiple [`AIMessageChunk`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessageChunk) objects, each containing a portion of the output text. Importantly, each chunk in a stream is designed to be gathered into a full message via summation:

```python Construct an AIMessage theme={null}
full = None  # None | AIMessageChunk
for chunk in model.stream("What color is the sky?"):
    full = chunk if full is None else full + chunk
    print(full.text)

# The
# The sky
# The sky is
# The sky is typically
# The sky is typically blue
# ...

print(full.content_blocks)
# [{"type": "text", "text": "The sky is typically blue..."}]
```

The resulting message can be treated the same as a message that was generated with [`invoke()`](#invoke) – for example, it can be aggregated into a message history and passed back to the model as conversational context.

<Warning>
  Streaming only works if all steps in the program know how to process a stream of chunks. For instance, an application that isn't streaming-capable would be one that needs to store the entire output in memory before it can be processed.
</Warning>

<Accordion title="Advanced streaming topics">
  <Accordion title="Streaming events">
    LangChain chat models can also stream semantic events using `astream_events()`.

    This simplifies filtering based on event types and other metadata, and will aggregate the full message in the background. See below for an example.

    ```python  theme={null}
    async for event in model.astream_events("Hello"):

        if event["event"] == "on_chat_model_start":
            print(f"Input: {event['data']['input']}")

        elif event["event"] == "on_chat_model_stream":
            print(f"Token: {event['data']['chunk'].text}")

        elif event["event"] == "on_chat_model_end":
            print(f"Full message: {event['data']['output'].text}")

        else:
            pass
    ```

    ```txt  theme={null}
    Input: Hello
    Token: Hi
    Token:  there
    Token: !
    Token:  How
    Token:  can
    Token:  I
    ...
    Full message: Hi there! How can I help today?
    ```

    <Tip>
      See the [`astream_events()`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.astream_events) reference for event types and other details.
    </Tip>
  </Accordion>

  <Accordion title="&#x22;Auto-streaming&#x22; chat models">
    LangChain simplifies streaming from chat models by automatically enabling streaming mode in certain cases, even when you're not explicitly calling the streaming methods. This is particularly useful when you use the non-streaming invoke method but still want to stream the entire application, including intermediate results from the chat model.

    In [LangGraph agents](/oss/python/langchain/agents), for example, you can call `model.invoke()` within nodes, but LangChain will automatically delegate to streaming if running in a streaming mode.

    #### How it works

    When you `invoke()` a chat model, LangChain will automatically switch to an internal streaming mode if it detects that you are trying to stream the overall application. The result of the invocation will be the same as far as the code that was using invoke is concerned; however, while the chat model is being streamed, LangChain will take care of invoking [`on_llm_new_token`](https://reference.langchain.com/python/langchain_core/callbacks/#langchain_core.callbacks.base.AsyncCallbackHandler.on_llm_new_token) events in LangChain's callback system.

    Callback events allow LangGraph `stream()` and `astream_events()` to surface the chat model's output in real-time.
  </Accordion>
</Accordion>

### Batch

Batching a collection of independent requests to a model can significantly improve performance and reduce costs, as the processing can be done in parallel:

```python Batch theme={null}
responses = model.batch([
    "Why do parrots have colorful feathers?",
    "How do airplanes fly?",
    "What is quantum computing?"
])
for response in responses:
    print(response)
```

<Note>
  This section describes a chat model method [`batch()`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch), which parallelizes model calls client-side.

  It is **distinct** from batch APIs supported by inference providers, such as [OpenAI](https://platform.openai.com/docs/guides/batch) or [Anthropic](https://platform.claude.com/docs/en/build-with-claude/batch-processing#message-batches-api).
</Note>

By default, [`batch()`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch) will only return the final output for the entire batch. If you want to receive the output for each individual input as it finishes generating, you can stream results with [`batch_as_completed()`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch_as_completed):

```python Yield batch responses upon completion theme={null}
for response in model.batch_as_completed([
    "Why do parrots have colorful feathers?",
    "How do airplanes fly?",
    "What is quantum computing?"
]):
    print(response)
```

<Note>
  When using [`batch_as_completed()`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch_as_completed), results may arrive out of order. Each includes the input index for matching to reconstruct the original order as needed.
</Note>

<Tip>
  When processing a large number of inputs using [`batch()`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch) or [`batch_as_completed()`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch_as_completed), you may want to control the maximum number of parallel calls. This can be done by setting the [`max_concurrency`](https://reference.langchain.com/python/langchain_core/runnables/#langchain_core.runnables.RunnableConfig.max_concurrency) attribute in the [`RunnableConfig`](https://reference.langchain.com/python/langchain_core/runnables/#langchain_core.runnables.RunnableConfig) dictionary.

  ```python Batch with max concurrency theme={null}
  model.batch(
      list_of_inputs,
      config={
          'max_concurrency': 5,  # Limit to 5 parallel calls
      }
  )
  ```

  See the [`RunnableConfig`](https://reference.langchain.com/python/langchain_core/runnables/#langchain_core.runnables.RunnableConfig) reference for a full list of supported attributes.
</Tip>

For more details on batching, see the [reference](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch).

***

## Tool calling

Models can request to call tools that perform tasks such as fetching data from a database, searching the web, or running code. Tools are pairings of:

1. A schema, including the name of the tool, a description, and/or argument definitions (often a JSON schema)
2. A function or <Tooltip tip="A method that can suspend execution and resume at a later time">coroutine</Tooltip> to execute.

<Note>
  You may hear the term "function calling". We use this interchangeably with "tool calling".
</Note>

Here's the basic tool calling flow between a user and a model:

```mermaid  theme={null}
sequenceDiagram
    participant U as User
    participant M as Model
    participant T as Tools

    U->>M: "What's the weather in SF and NYC?"
    M->>M: Analyze request & decide tools needed

    par Parallel Tool Calls
        M->>T: get_weather("San Francisco")
        M->>T: get_weather("New York")
    end

    par Tool Execution
        T-->>M: SF weather data
        T-->>M: NYC weather data
    end

    M->>M: Process results & generate response
    M->>U: "SF: 72°F sunny, NYC: 68°F cloudy"
```

To make tools that you have defined available for use by a model, you must bind them using [`bind_tools`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.bind_tools). In subsequent invocations, the model can choose to call any of the bound tools as needed.

Some model providers offer <Tooltip tip="Tools that are executed server-side, such as web search and code interpreters">built-in tools</Tooltip> that can be enabled via model or invocation parameters (e.g. [`ChatOpenAI`](/oss/python/integrations/chat/openai), [`ChatAnthropic`](/oss/python/integrations/chat/anthropic)). Check the respective [provider reference](/oss/python/integrations/providers/overview) for details.

<Tip>
  See the [tools guide](/oss/python/langchain/tools) for details and other options for creating tools.
</Tip>

```python Binding user tools theme={null}
from langchain.tools import tool

@tool
def get_weather(location: str) -> str:
    """Get the weather at a location."""
    return f"It's sunny in {location}."


model_with_tools = model.bind_tools([get_weather])  # [!code highlight]

response = model_with_tools.invoke("What's the weather like in Boston?")
for tool_call in response.tool_calls:
    # View tool calls made by the model
    print(f"Tool: {tool_call['name']}")
    print(f"Args: {tool_call['args']}")
```

When binding user-defined tools, the model's response includes a **request** to execute a tool. When using a model separately from an [agent](/oss/python/langchain/agents), it is up to you to execute the requested tool and return the result back to the model for use in subsequent reasoning. When using an [agent](/oss/python/langchain/agents), the agent loop will handle the tool execution loop for you.

Below, we show some common ways you can use tool calling.

<AccordionGroup>
  <Accordion title="Tool execution loop" icon="arrow-rotate-right">
    When a model returns tool calls, you need to execute the tools and pass the results back to the model. This creates a conversation loop where the model can use tool results to generate its final response. LangChain includes [agent](/oss/python/langchain/agents) abstractions that handle this orchestration for you.

    Here's a simple example of how to do this:

    ```python Tool execution loop theme={null}
    # Bind (potentially multiple) tools to the model
    model_with_tools = model.bind_tools([get_weather])

    # Step 1: Model generates tool calls
    messages = [{"role": "user", "content": "What's the weather in Boston?"}]
    ai_msg = model_with_tools.invoke(messages)
    messages.append(ai_msg)

    # Step 2: Execute tools and collect results
    for tool_call in ai_msg.tool_calls:
        # Execute the tool with the generated arguments
        tool_result = get_weather.invoke(tool_call)
        messages.append(tool_result)

    # Step 3: Pass results back to model for final response
    final_response = model_with_tools.invoke(messages)
    print(final_response.text)
    # "The current weather in Boston is 72°F and sunny."
    ```

    Each [`ToolMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage) returned by the tool includes a `tool_call_id` that matches the original tool call, helping the model correlate results with requests.
  </Accordion>

  <Accordion title="Forcing tool calls" icon="asterisk">
    By default, the model has the freedom to choose which bound tool to use based on the user's input. However, you might want to force choosing a tool, ensuring the model uses either a particular tool or **any** tool from a given list:

    <CodeGroup>
      ```python Force use of any tool theme={null}
      model_with_tools = model.bind_tools([tool_1], tool_choice="any")
      ```

      ```python Force use of specific tools theme={null}
      model_with_tools = model.bind_tools([tool_1], tool_choice="tool_1")
      ```
    </CodeGroup>
  </Accordion>

  <Accordion title="Parallel tool calls" icon="layer-group">
    Many models support calling multiple tools in parallel when appropriate. This allows the model to gather information from different sources simultaneously.

    ```python Parallel tool calls theme={null}
    model_with_tools = model.bind_tools([get_weather])

    response = model_with_tools.invoke(
        "What's the weather in Boston and Tokyo?"
    )


    # The model may generate multiple tool calls
    print(response.tool_calls)
    # [
    #   {'name': 'get_weather', 'args': {'location': 'Boston'}, 'id': 'call_1'},
    #   {'name': 'get_weather', 'args': {'location': 'Tokyo'}, 'id': 'call_2'},
    # ]


    # Execute all tools (can be done in parallel with async)
    results = []
    for tool_call in response.tool_calls:
        if tool_call['name'] == 'get_weather':
            result = get_weather.invoke(tool_call)
        ...
        results.append(result)
    ```

    The model intelligently determines when parallel execution is appropriate based on the independence of the requested operations.

    <Tip>
      Most models supporting tool calling enable parallel tool calls by default. Some (including [OpenAI](/oss/python/integrations/chat/openai) and [Anthropic](/oss/python/integrations/chat/anthropic)) allow you to disable this feature. To do this, set `parallel_tool_calls=False`:

      ```python  theme={null}
      model.bind_tools([get_weather], parallel_tool_calls=False)
      ```
    </Tip>
  </Accordion>

  <Accordion title="Streaming tool calls" icon="rss">
    When streaming responses, tool calls are progressively built through [`ToolCallChunk`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolCallChunk). This allows you to see tool calls as they're being generated rather than waiting for the complete response.

    ```python Streaming tool calls theme={null}
    for chunk in model_with_tools.stream(
        "What's the weather in Boston and Tokyo?"
    ):
        # Tool call chunks arrive progressively
        for tool_chunk in chunk.tool_call_chunks:
            if name := tool_chunk.get("name"):
                print(f"Tool: {name}")
            if id_ := tool_chunk.get("id"):
                print(f"ID: {id_}")
            if args := tool_chunk.get("args"):
                print(f"Args: {args}")

    # Output:
    # Tool: get_weather
    # ID: call_SvMlU1TVIZugrFLckFE2ceRE
    # Args: {"lo
    # Args: catio
    # Args: n": "B
    # Args: osto
    # Args: n"}
    # Tool: get_weather
    # ID: call_QMZdy6qInx13oWKE7KhuhOLR
    # Args: {"lo
    # Args: catio
    # Args: n": "T
    # Args: okyo
    # Args: "}
    ```

    You can accumulate chunks to build complete tool calls:

    ```python Accumulate tool calls theme={null}
    gathered = None
    for chunk in model_with_tools.stream("What's the weather in Boston?"):
        gathered = chunk if gathered is None else gathered + chunk
        print(gathered.tool_calls)
    ```
  </Accordion>
</AccordionGroup>

***

## Structured output

Models can be requested to provide their response in a format matching a given schema. This is useful for ensuring the output can be easily parsed and used in subsequent processing. LangChain supports multiple schema types and methods for enforcing structured output.

<Tabs>
  <Tab title="Pydantic">
    [Pydantic models](https://docs.pydantic.dev/latest/concepts/models/#basic-model-usage) provide the richest feature set with field validation, descriptions, and nested structures.

    ```python  theme={null}
    from pydantic import BaseModel, Field

    class Movie(BaseModel):
        """A movie with details."""
        title: str = Field(..., description="The title of the movie")
        year: int = Field(..., description="The year the movie was released")
        director: str = Field(..., description="The director of the movie")
        rating: float = Field(..., description="The movie's rating out of 10")

    model_with_structure = model.with_structured_output(Movie)
    response = model_with_structure.invoke("Provide details about the movie Inception")
    print(response)  # Movie(title="Inception", year=2010, director="Christopher Nolan", rating=8.8)
    ```
  </Tab>

  <Tab title="TypedDict">
    `TypedDict` provides a simpler alternative using Python's built-in typing, ideal when you don't need runtime validation.

    ```python  theme={null}
    from typing_extensions import TypedDict, Annotated

    class MovieDict(TypedDict):
        """A movie with details."""
        title: Annotated[str, ..., "The title of the movie"]
        year: Annotated[int, ..., "The year the movie was released"]
        director: Annotated[str, ..., "The director of the movie"]
        rating: Annotated[float, ..., "The movie's rating out of 10"]

    model_with_structure = model.with_structured_output(MovieDict)
    response = model_with_structure.invoke("Provide details about the movie Inception")
    print(response)  # {'title': 'Inception', 'year': 2010, 'director': 'Christopher Nolan', 'rating': 8.8}
    ```
  </Tab>

  <Tab title="JSON Schema">
    For maximum control or interoperability, you can provide a raw JSON Schema.

    ```python  theme={null}
    import json

    json_schema = {
        "title": "Movie",
        "description": "A movie with details",
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "description": "The title of the movie"
            },
            "year": {
                "type": "integer",
                "description": "The year the movie was released"
            },
            "director": {
                "type": "string",
                "description": "The director of the movie"
            },
            "rating": {
                "type": "number",
                "description": "The movie's rating out of 10"
            }
        },
        "required": ["title", "year", "director", "rating"]
    }

    model_with_structure = model.with_structured_output(
        json_schema,
        method="json_schema",
    )
    response = model_with_structure.invoke("Provide details about the movie Inception")
    print(response)  # {'title': 'Inception', 'year': 2010, ...}
    ```
  </Tab>
</Tabs>

<Note>
  **Key considerations for structured output:**

  * **Method parameter**: Some providers support different methods (`'json_schema'`, `'function_calling'`, `'json_mode'`)
    * `'json_schema'` typically refers to dedicated structured output features offered by a provider
    * `'function_calling'` derives structured output by forcing a [tool call](#tool-calling) following the given schema
    * `'json_mode'` is a precursor to `'json_schema'` offered by some providers - it generates valid json, but the schema must be described in the prompt
  * **Include raw**: Use `include_raw=True` to get both the parsed output and the raw AI message
  * **Validation**: Pydantic models provide automatic validation, while `TypedDict` and JSON Schema require manual validation
</Note>

<Accordion title="Example: Message output alongside parsed structure">
  It can be useful to return the raw [`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage) object alongside the parsed representation to access response metadata such as [token counts](#token-usage). To do this, set [`include_raw=True`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.with_structured_output\(include_raw\)) when calling [`with_structured_output`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.with_structured_output):

  ```python  theme={null}
  from pydantic import BaseModel, Field

  class Movie(BaseModel):
      """A movie with details."""
      title: str = Field(..., description="The title of the movie")
      year: int = Field(..., description="The year the movie was released")
      director: str = Field(..., description="The director of the movie")
      rating: float = Field(..., description="The movie's rating out of 10")

  model_with_structure = model.with_structured_output(Movie, include_raw=True)  # [!code highlight]
  response = model_with_structure.invoke("Provide details about the movie Inception")
  response
  # {
  #     "raw": AIMessage(...),
  #     "parsed": Movie(title=..., year=..., ...),
  #     "parsing_error": None,
  # }
  ```
</Accordion>

<Accordion title="Example: Nested structures">
  Schemas can be nested:

  <CodeGroup>
    ```python Pydantic BaseModel theme={null}
    from pydantic import BaseModel, Field

    class Actor(BaseModel):
        name: str
        role: str

    class MovieDetails(BaseModel):
        title: str
        year: int
        cast: list[Actor]
        genres: list[str]
        budget: float | None = Field(None, description="Budget in millions USD")

    model_with_structure = model.with_structured_output(MovieDetails)
    ```

    ```python TypedDict theme={null}
    from typing_extensions import Annotated, TypedDict

    class Actor(TypedDict):
        name: str
        role: str

    class MovieDetails(TypedDict):
        title: str
        year: int
        cast: list[Actor]
        genres: list[str]
        budget: Annotated[float | None, ..., "Budget in millions USD"]

    model_with_structure = model.with_structured_output(MovieDetails)
    ```
  </CodeGroup>
</Accordion>

***

## Supported models

LangChain supports all major model providers, including OpenAI, Anthropic, Google, Azure, AWS Bedrock, and more. Each provider offers a variety of models with different capabilities. For a full list of supported models in LangChain, see the [integrations page](/oss/python/integrations/providers/overview).

***

## Advanced topics

### Model profiles

<Warning> This is a beta feature. The format of model profiles is subject to change. </Warning>

<Info> Model profiles require `langchain>=1.1`. </Info>

LangChain chat models can expose a dictionary of supported features and capabilities through a `.profile` attribute:

```python  theme={null}
model.profile
# {
#   "max_input_tokens": 400000,
#   "image_inputs": True,
#   "reasoning_output": True,
#   "tool_calling": True,
#   ...
# }
```

Refer to the full set of fields in the [API reference](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.BaseChatModel.profile).

Much of the model profile data is powered by the [models.dev](https://github.com/sst/models.dev) project, an open source initiative that provides model capability data. These data are augmented with additional fields for purposes of use with LangChain. These augmentations are kept aligned with the upstream project as it evolves.

Model profile data allow applications to work around model capabilities dynamically. For example:

1. [Summarization middleware](/oss/python/langchain/middleware/built-in#summarization) can trigger summarization based on a model's context window size.
2. [Structured output](/oss/python/langchain/structured-output) strategies in `create_agent` can be inferred automatically (e.g., by checking support for native structured output features).
3. Model inputs can be gated based on supported [modalities](#multimodal) and maximum input tokens.

<Accordion title="Modify profile data">
  Model profile data can be changed if it is missing, stale, or incorrect.

  **Option 1 (quick fix)**

  You can instantiate a chat model with any valid profile:

  ```python  theme={null}
  custom_profile = {
      "max_input_tokens": 100_000,
      "tool_calling": True,
      "structured_output": True,
      # ...
  }
  model = init_chat_model("...", profile=custom_profile)
  ```

  The `profile` is also a regular `dict` and can be updated in place. If the model instance is shared, consider using `model_copy` to avoid mutating shared state.

  ```python  theme={null}
  new_profile = model.profile | {"key": "value"}
  model.model_copy(update={"profile": new_profile})
  ```

  **Option 2 (fix data upstream)**

  The primary source for the data is the [models.dev](https://models.dev/) project. This data is merged with additional fields and overrides in LangChain [integration packages](/oss/python/integrations/providers/overview) and are shipped with those packages.

  Model profile data can be updated through the following process:

  1. (If needed) update the source data at [models.dev](https://models.dev/) through a pull request to its [repository on Github](https://github.com/sst/models.dev).
  2. (If needed) update additional fields and overrides in `langchain_<package>/data/profile_augmentations.toml` through a pull request to the LangChain [integration package](/oss/python/integrations/providers/overview)\`.
  3. Use the [`langchain-model-profiles`](https://pypi.org/project/langchain-model-profiles/) CLI tool to pull the latest data from [models.dev](https://models.dev/), merge in the augmentations and update the profile data:

  ```bash  theme={null}
  pip install langchain-model-profiles
  ```

  ```bash  theme={null}
  langchain-profiles refresh --provider <provider> --data-dir <data_dir>
  ```

  This command:

  * Downloads the latest data for `<provider>` from models.dev
  * Merges augmentations from `profile_augmentations.toml` in `<data_dir>`
  * Writes merged profiles to `profiles.py` in `<data_dir>`

  For example: from [`libs/partners/anthropic`](https://github.com/langchain-ai/langchain/tree/master/libs/partners/anthropic) in the [LangChain monorepo](https://github.com/langchain-ai/langchain):

  ```bash  theme={null}
  uv run --with langchain-model-profiles --provider anthropic --data-dir langchain_anthropic/data
  ```
</Accordion>

### Multimodal

Certain models can process and return non-textual data such as images, audio, and video. You can pass non-textual data to a model by providing [content blocks](/oss/python/langchain/messages#message-content).

<Tip>
  All LangChain chat models with underlying multimodal capabilities support:

  1. Data in the cross-provider standard format (see [our messages guide](/oss/python/langchain/messages))
  2. OpenAI [chat completions](https://platform.openai.com/docs/api-reference/chat) format
  3. Any format that is native to that specific provider (e.g., Anthropic models accept Anthropic native format)
</Tip>

See the [multimodal section](/oss/python/langchain/messages#multimodal) of the messages guide for details.

<Tooltip tip="Not all LLMs are made equally!" cta="See reference" href="https://models.dev/">Some models</Tooltip> can return multimodal data as part of their response. If invoked to do so, the resulting [`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage) will have content blocks with multimodal types.

```python Multimodal output theme={null}
response = model.invoke("Create a picture of a cat")
print(response.content_blocks)
# [
#     {"type": "text", "text": "Here's a picture of a cat"},
#     {"type": "image", "base64": "...", "mime_type": "image/jpeg"},
# ]
```

See the [integrations page](/oss/python/integrations/providers/overview) for details on specific providers.

### Reasoning

Many models are capable of performing multi-step reasoning to arrive at a conclusion. This involves breaking down complex problems into smaller, more manageable steps.

**If supported by the underlying model,** you can surface this reasoning process to better understand how the model arrived at its final answer.

<CodeGroup>
  ```python Stream reasoning output theme={null}
  for chunk in model.stream("Why do parrots have colorful feathers?"):
      reasoning_steps = [r for r in chunk.content_blocks if r["type"] == "reasoning"]
      print(reasoning_steps if reasoning_steps else chunk.text)
  ```

  ```python Complete reasoning output theme={null}
  response = model.invoke("Why do parrots have colorful feathers?")
  reasoning_steps = [b for b in response.content_blocks if b["type"] == "reasoning"]
  print(" ".join(step["reasoning"] for step in reasoning_steps))
  ```
</CodeGroup>

Depending on the model, you can sometimes specify the level of effort it should put into reasoning. Similarly, you can request that the model turn off reasoning entirely. This may take the form of categorical "tiers" of reasoning (e.g., `'low'` or `'high'`) or integer token budgets.

For details, see the [integrations page](/oss/python/integrations/providers/overview) or [reference](https://reference.langchain.com/python/integrations/) for your respective chat model.

### Local models

LangChain supports running models locally on your own hardware. This is useful for scenarios where either data privacy is critical, you want to invoke a custom model, or when you want to avoid the costs incurred when using a cloud-based model.

[Ollama](/oss/python/integrations/chat/ollama) is one of the easiest ways to run models locally. See the full list of local integrations on the [integrations page](/oss/python/integrations/providers/overview).

### Prompt caching

Many providers offer prompt caching features to reduce latency and cost on repeat processing of the same tokens. These features can be **implicit** or **explicit**:

* **Implicit prompt caching:** providers will automatically pass on cost savings if a request hits a cache. Examples: [OpenAI](/oss/python/integrations/chat/openai) and [Gemini](/oss/python/integrations/chat/google_generative_ai).
* **Explicit caching:** providers allow you to manually indicate cache points for greater control or to guarantee cost savings. Examples:
  * [`ChatOpenAI`](https://reference.langchain.com/python/integrations/langchain_openai/ChatOpenAI) (via `prompt_cache_key`)
  * Anthropic's [`AnthropicPromptCachingMiddleware`](/oss/python/integrations/chat/anthropic#prompt-caching)
  * [Gemini](https://python.langchain.com/api_reference/google_genai/chat_models/langchain_google_genai.chat_models.ChatGoogleGenerativeAI.html).
  * [AWS Bedrock](/oss/python/integrations/chat/bedrock#prompt-caching)

<Warning>
  Prompt caching is often only engaged above a minimum input token threshold. See [provider pages](/oss/python/integrations/chat) for details.
</Warning>

Cache usage will be reflected in the [usage metadata](/oss/python/langchain/messages#token-usage) of the model response.

### Server-side tool use

Some providers support server-side [tool-calling](#tool-calling) loops: models can interact with web search, code interpreters, and other tools and analyze the results in a single conversational turn.

If a model invokes a tool server-side, the content of the response message will include content representing the invocation and result of the tool. Accessing the [content blocks](/oss/python/langchain/messages#standard-content-blocks) of the response will return the server-side tool calls and results in a provider-agnostic format:

```python Invoke with server-side tool use theme={null}
from langchain.chat_models import init_chat_model

model = init_chat_model("gpt-4.1-mini")

tool = {"type": "web_search"}
model_with_tools = model.bind_tools([tool])

response = model_with_tools.invoke("What was a positive news story from today?")
response.content_blocks
```

```python Result expandable theme={null}
[
    {
        "type": "server_tool_call",
        "name": "web_search",
        "args": {
            "query": "positive news stories today",
            "type": "search"
        },
        "id": "ws_abc123"
    },
    {
        "type": "server_tool_result",
        "tool_call_id": "ws_abc123",
        "status": "success"
    },
    {
        "type": "text",
        "text": "Here are some positive news stories from today...",
        "annotations": [
            {
                "end_index": 410,
                "start_index": 337,
                "title": "article title",
                "type": "citation",
                "url": "..."
            }
        ]
    }
]
```

This represents a single conversational turn; there are no associated [ToolMessage](/oss/python/langchain/messages#tool-message) objects that need to be passed in as in client-side [tool-calling](#tool-calling).

See the [integration page](/oss/python/integrations/chat) for your given provider for available tools and usage details.

### Rate limiting

Many chat model providers impose a limit on the number of invocations that can be made in a given time period. If you hit a rate limit, you will typically receive a rate limit error response from the provider, and will need to wait before making more requests.

To help manage rate limits, chat model integrations accept a `rate_limiter` parameter that can be provided during initialization to control the rate at which requests are made.

<Accordion title="Initialize and use a rate limiter" icon="gauge-high">
  LangChain in comes with (an optional) built-in [`InMemoryRateLimiter`](https://reference.langchain.com/python/langchain_core/rate_limiters/#langchain_core.rate_limiters.InMemoryRateLimiter). This limiter is thread safe and can be shared by multiple threads in the same process.

  ```python Define a rate limiter theme={null}
  from langchain_core.rate_limiters import InMemoryRateLimiter

  rate_limiter = InMemoryRateLimiter(
      requests_per_second=0.1,  # 1 request every 10s
      check_every_n_seconds=0.1,  # Check every 100ms whether allowed to make a request
      max_bucket_size=10,  # Controls the maximum burst size.
  )

  model = init_chat_model(
      model="gpt-5",
      model_provider="openai",
      rate_limiter=rate_limiter  # [!code highlight]
  )
  ```

  <Warning>
    The provided rate limiter can only limit the number of requests per unit time. It will not help if you need to also limit based on the size of the requests.
  </Warning>
</Accordion>

### Base URL or proxy

For many chat model integrations, you can configure the base URL for API requests, which allows you to use model providers that have OpenAI-compatible APIs or to use a proxy server.

<Accordion title="Base URL" icon="link">
  Many model providers offer OpenAI-compatible APIs (e.g., [Together AI](https://www.together.ai/), [vLLM](https://github.com/vllm-project/vllm)). You can use [`init_chat_model`](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model) with these providers by specifying the appropriate `base_url` parameter:

  ```python  theme={null}
  model = init_chat_model(
      model="MODEL_NAME",
      model_provider="openai",
      base_url="BASE_URL",
      api_key="YOUR_API_KEY",
  )
  ```

  <Note>
    When using direct chat model class instantiation, the parameter name may vary by provider. Check the respective [reference](/oss/python/integrations/providers/overview) for details.
  </Note>
</Accordion>

<Accordion title="Proxy configuration" icon="shield">
  For deployments requiring HTTP proxies, some model integrations support proxy configuration:

  ```python  theme={null}
  from langchain_openai import ChatOpenAI

  model = ChatOpenAI(
      model="gpt-4o",
      openai_proxy="http://proxy.example.com:8080"
  )
  ```

  <Note>
    Proxy support varies by integration. Check the specific model provider's [reference](/oss/python/integrations/providers/overview) for proxy configuration options.
  </Note>
</Accordion>

### Log probabilities

Certain models can be configured to return token-level log probabilities representing the likelihood of a given token by setting the `logprobs` parameter when initializing the model:

```python  theme={null}
model = init_chat_model(
    model="gpt-4o",
    model_provider="openai"
).bind(logprobs=True)

response = model.invoke("Why do parrots talk?")
print(response.response_metadata["logprobs"])
```

### Token usage

A number of model providers return token usage information as part of the invocation response. When available, this information will be included on the [`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage) objects produced by the corresponding model. For more details, see the [messages](/oss/python/langchain/messages) guide.

<Note>
  Some provider APIs, notably OpenAI and Azure OpenAI chat completions, require users opt-in to receiving token usage data in streaming contexts. See the [streaming usage metadata](/oss/python/integrations/chat/openai#streaming-usage-metadata) section of the integration guide for details.
</Note>

You can track aggregate token counts across models in an application using either a callback or context manager, as shown below:

<Tabs>
  <Tab title="Callback handler">
    ```python  theme={null}
    from langchain.chat_models import init_chat_model
    from langchain_core.callbacks import UsageMetadataCallbackHandler

    model_1 = init_chat_model(model="gpt-4o-mini")
    model_2 = init_chat_model(model="claude-haiku-4-5-20251001")

    callback = UsageMetadataCallbackHandler()
    result_1 = model_1.invoke("Hello", config={"callbacks": [callback]})
    result_2 = model_2.invoke("Hello", config={"callbacks": [callback]})
    callback.usage_metadata
    ```

    ```python  theme={null}
    {
        'gpt-4o-mini-2024-07-18': {
            'input_tokens': 8,
            'output_tokens': 10,
            'total_tokens': 18,
            'input_token_details': {'audio': 0, 'cache_read': 0},
            'output_token_details': {'audio': 0, 'reasoning': 0}
        },
        'claude-haiku-4-5-20251001': {
            'input_tokens': 8,
            'output_tokens': 21,
            'total_tokens': 29,
            'input_token_details': {'cache_read': 0, 'cache_creation': 0}
        }
    }
    ```
  </Tab>

  <Tab title="Context manager">
    ```python  theme={null}
    from langchain.chat_models import init_chat_model
    from langchain_core.callbacks import get_usage_metadata_callback

    model_1 = init_chat_model(model="gpt-4o-mini")
    model_2 = init_chat_model(model="claude-haiku-4-5-20251001")

    with get_usage_metadata_callback() as cb:
        model_1.invoke("Hello")
        model_2.invoke("Hello")
        print(cb.usage_metadata)
    ```

    ```python  theme={null}
    {
        'gpt-4o-mini-2024-07-18': {
            'input_tokens': 8,
            'output_tokens': 10,
            'total_tokens': 18,
            'input_token_details': {'audio': 0, 'cache_read': 0},
            'output_token_details': {'audio': 0, 'reasoning': 0}
        },
        'claude-haiku-4-5-20251001': {
            'input_tokens': 8,
            'output_tokens': 21,
            'total_tokens': 29,
            'input_token_details': {'cache_read': 0, 'cache_creation': 0}
        }
    }
    ```
  </Tab>
</Tabs>

### Invocation config

When invoking a model, you can pass additional configuration through the `config` parameter using a [`RunnableConfig`](https://reference.langchain.com/python/langchain_core/runnables/#langchain_core.runnables.RunnableConfig) dictionary. This provides run-time control over execution behavior, callbacks, and metadata tracking.

Common configuration options include:

```python Invocation with config theme={null}
response = model.invoke(
    "Tell me a joke",
    config={
        "run_name": "joke_generation",      # Custom name for this run
        "tags": ["humor", "demo"],          # Tags for categorization
        "metadata": {"user_id": "123"},     # Custom metadata
        "callbacks": [my_callback_handler], # Callback handlers
    }
)
```

These configuration values are particularly useful when:

* Debugging with [LangSmith](https://docs.smith.langchain.com/) tracing
* Implementing custom logging or monitoring
* Controlling resource usage in production
* Tracking invocations across complex pipelines

<Accordion title="Key configuration attributes">
  <ParamField body="run_name" type="string">
    Identifies this specific invocation in logs and traces. Not inherited by sub-calls.
  </ParamField>

  <ParamField body="tags" type="string[]">
    Labels inherited by all sub-calls for filtering and organization in debugging tools.
  </ParamField>

  <ParamField body="metadata" type="object">
    Custom key-value pairs for tracking additional context, inherited by all sub-calls.
  </ParamField>

  <ParamField body="max_concurrency" type="number">
    Controls the maximum number of parallel calls when using [`batch()`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch) or [`batch_as_completed()`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.batch_as_completed).
  </ParamField>

  <ParamField body="callbacks" type="array">
    Handlers for monitoring and responding to events during execution.
  </ParamField>

  <ParamField body="recursion_limit" type="number">
    Maximum recursion depth for chains to prevent infinite loops in complex pipelines.
  </ParamField>
</Accordion>

<Tip>
  See full [`RunnableConfig`](https://reference.langchain.com/python/langchain_core/runnables/#langchain_core.runnables.RunnableConfig) reference for all supported attributes.
</Tip>

### Configurable models

You can also create a runtime-configurable model by specifying [`configurable_fields`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.language_models.chat_models.BaseChatModel.configurable_fields). If you don't specify a model value, then `'model'` and `'model_provider'` will be configurable by default.

```python  theme={null}
from langchain.chat_models import init_chat_model

configurable_model = init_chat_model(temperature=0)

configurable_model.invoke(
    "what's your name",
    config={"configurable": {"model": "gpt-5-nano"}},  # Run with GPT-5-Nano
)
configurable_model.invoke(
    "what's your name",
    config={"configurable": {"model": "claude-sonnet-4-5-20250929"}},  # Run with Claude
)
```

<Accordion title="Configurable model with default values">
  We can create a configurable model with default model values, specify which parameters are configurable, and add prefixes to configurable params:

  ```python  theme={null}
  first_model = init_chat_model(
          model="gpt-4.1-mini",
          temperature=0,
          configurable_fields=("model", "model_provider", "temperature", "max_tokens"),
          config_prefix="first",  # Useful when you have a chain with multiple models
  )

  first_model.invoke("what's your name")
  ```

  ```python  theme={null}
  first_model.invoke(
      "what's your name",
      config={
          "configurable": {
              "first_model": "claude-sonnet-4-5-20250929",
              "first_temperature": 0.5,
              "first_max_tokens": 100,
          }
      },
  )
  ```

  See the [`init_chat_model`](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model) reference for more details on `configurable_fields` and `config_prefix`.
</Accordion>

<Accordion title="Using a configurable model declaratively">
  We can call declarative operations like `bind_tools`, `with_structured_output`, `with_configurable`, etc. on a configurable model and chain a configurable model in the same way that we would a regularly instantiated chat model object.

  ```python  theme={null}
  from pydantic import BaseModel, Field


  class GetWeather(BaseModel):
      """Get the current weather in a given location"""

          location: str = Field(..., description="The city and state, e.g. San Francisco, CA")


  class GetPopulation(BaseModel):
      """Get the current population in a given location"""

          location: str = Field(..., description="The city and state, e.g. San Francisco, CA")


  model = init_chat_model(temperature=0)
  model_with_tools = model.bind_tools([GetWeather, GetPopulation])

  model_with_tools.invoke(
      "what's bigger in 2024 LA or NYC", config={"configurable": {"model": "gpt-4.1-mini"}}
  ).tool_calls
  ```

  ```
  [
      {
          'name': 'GetPopulation',
          'args': {'location': 'Los Angeles, CA'},
          'id': 'call_Ga9m8FAArIyEjItHmztPYA22',
          'type': 'tool_call'
      },
      {
          'name': 'GetPopulation',
          'args': {'location': 'New York, NY'},
          'id': 'call_jh2dEvBaAHRaw5JUDthOs7rt',
          'type': 'tool_call'
      }
  ]
  ```

  ```python  theme={null}
  model_with_tools.invoke(
      "what's bigger in 2024 LA or NYC",
      config={"configurable": {"model": "claude-sonnet-4-5-20250929"}},
  ).tool_calls
  ```

  ```
  [
      {
          'name': 'GetPopulation',
          'args': {'location': 'Los Angeles, CA'},
          'id': 'toolu_01JMufPf4F4t2zLj7miFeqXp',
          'type': 'tool_call'
      },
      {
          'name': 'GetPopulation',
          'args': {'location': 'New York City, NY'},
          'id': 'toolu_01RQBHcE8kEEbYTuuS8WqY1u',
          'type': 'tool_call'
      }
  ]
  ```
</Accordion>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/models.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


-----------------------------------------https://docs.langchain.com/oss/python/langchain/messages-----------------------------------------https://docs.langchain.com/oss/python/langchain/messages-----------------------------------------https://docs.langchain.com/oss/python/langchain/messages-----------------------------------------https://docs.langchain.com/oss/python/langchain/messages-----------------------------------------https://docs.langchain.com/oss/python/langchain/messages-----------------------------------------https://docs.langchain.com/oss/python/langchain/messages-----------------------------------------https://docs.langchain.com/oss/python/langchain/messages


# Messages

Messages are the fundamental unit of context for models in LangChain. They represent the input and output of models, carrying both the content and metadata needed to represent the state of a conversation when interacting with an LLM.

Messages are objects that contain:

* <Icon icon="user" size={16} /> [**Role**](#message-types) - Identifies the message type (e.g. `system`, `user`)
* <Icon icon="folder-closed" size={16} /> [**Content**](#message-content) - Represents the actual content of the message (like text, images, audio, documents, etc.)
* <Icon icon="tag" size={16} /> [**Metadata**](#message-metadata) - Optional fields such as response information, message IDs, and token usage

LangChain provides a standard message type that works across all model providers, ensuring consistent behavior regardless of the model being called.

## Basic usage

The simplest way to use messages is to create message objects and pass them to a model when [invoking](/oss/python/langchain/models#invocation).

```python  theme={null}
from langchain.chat_models import init_chat_model
from langchain.messages import HumanMessage, AIMessage, SystemMessage

model = init_chat_model("gpt-5-nano")

system_msg = SystemMessage("You are a helpful assistant.")
human_msg = HumanMessage("Hello, how are you?")

# Use with chat models
messages = [system_msg, human_msg]
response = model.invoke(messages)  # Returns AIMessage
```

### Text prompts

Text prompts are strings - ideal for straightforward generation tasks where you don't need to retain conversation history.

```python  theme={null}
response = model.invoke("Write a haiku about spring")
```

**Use text prompts when:**

* You have a single, standalone request
* You don't need conversation history
* You want minimal code complexity

### Message prompts

Alternatively, you can pass in a list of messages to the model by providing a list of message objects.

```python  theme={null}
from langchain.messages import SystemMessage, HumanMessage, AIMessage

messages = [
    SystemMessage("You are a poetry expert"),
    HumanMessage("Write a haiku about spring"),
    AIMessage("Cherry blossoms bloom...")
]
response = model.invoke(messages)
```

**Use message prompts when:**

* Managing multi-turn conversations
* Working with multimodal content (images, audio, files)
* Including system instructions

### Dictionary format

You can also specify messages directly in OpenAI chat completions format.

```python  theme={null}
messages = [
    {"role": "system", "content": "You are a poetry expert"},
    {"role": "user", "content": "Write a haiku about spring"},
    {"role": "assistant", "content": "Cherry blossoms bloom..."}
]
response = model.invoke(messages)
```

## Message types

* <Icon icon="gear" size={16} /> [System message](#system-message) - Tells the model how to behave and provide context for interactions
* <Icon icon="user" size={16} /> [Human message](#human-message) - Represents user input and interactions with the model
* <Icon icon="robot" size={16} /> [AI message](#ai-message) - Responses generated by the model, including text content, tool calls, and metadata
* <Icon icon="wrench" size={16} /> [Tool message](#tool-message) - Represents the outputs of [tool calls](/oss/python/langchain/models#tool-calling)

### System Message

A [`SystemMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.SystemMessage) represent an initial set of instructions that primes the model's behavior. You can use a system message to set the tone, define the model's role, and establish guidelines for responses.

```python Basic instructions theme={null}
system_msg = SystemMessage("You are a helpful coding assistant.")

messages = [
    system_msg,
    HumanMessage("How do I create a REST API?")
]
response = model.invoke(messages)
```

```python Detailed persona theme={null}
from langchain.messages import SystemMessage, HumanMessage

system_msg = SystemMessage("""
You are a senior Python developer with expertise in web frameworks.
Always provide code examples and explain your reasoning.
Be concise but thorough in your explanations.
""")

messages = [
    system_msg,
    HumanMessage("How do I create a REST API?")
]
response = model.invoke(messages)
```

***

### Human Message

A [`HumanMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.HumanMessage) represents user input and interactions. They can contain text, images, audio, files, and any other amount of multimodal [content](#message-content).

#### Text content

<CodeGroup>
  ```python Message object theme={null}
  response = model.invoke([
    HumanMessage("What is machine learning?")
  ])
  ```

  ```python String shortcut theme={null}
  # Using a string is a shortcut for a single HumanMessage
  response = model.invoke("What is machine learning?")
  ```
</CodeGroup>

#### Message metadata

```python Add metadata theme={null}
human_msg = HumanMessage(
    content="Hello!",
    name="alice",  # Optional: identify different users
    id="msg_123",  # Optional: unique identifier for tracing
)
```

<Note>
  The `name` field behavior varies by provider – some use it for user identification, others ignore it. To check, refer to the model provider's [reference](https://reference.langchain.com/python/integrations/).
</Note>

***

### AI Message

An [`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage) represents the output of a model invocation. They can include multimodal data, tool calls, and provider-specific metadata that you can later access.

```python  theme={null}
response = model.invoke("Explain AI")
print(type(response))  # <class 'langchain.messages.AIMessage'>
```

[`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage) objects are returned by the model when calling it, which contains all of the associated metadata in the response.

Providers weigh/contextualize types of messages differently, which means it is sometimes helpful to manually create a new [`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage) object and insert it into the message history as if it came from the model.

```python  theme={null}
from langchain.messages import AIMessage, SystemMessage, HumanMessage

# Create an AI message manually (e.g., for conversation history)
ai_msg = AIMessage("I'd be happy to help you with that question!")

# Add to conversation history
messages = [
    SystemMessage("You are a helpful assistant"),
    HumanMessage("Can you help me?"),
    ai_msg,  # Insert as if it came from the model
    HumanMessage("Great! What's 2+2?")
]

response = model.invoke(messages)
```

<Accordion title="Attributes">
  <ParamField path="text" type="string">
    The text content of the message.
  </ParamField>

  <ParamField path="content" type="string | dict[]">
    The raw content of the message.
  </ParamField>

  <ParamField path="content_blocks" type="ContentBlock[]">
    The standardized [content blocks](#message-content) of the message.
  </ParamField>

  <ParamField path="tool_calls" type="dict[] | None">
    The tool calls made by the model.

    Empty if no tools are called.
  </ParamField>

  <ParamField path="id" type="string">
    A unique identifier for the message (either automatically generated by LangChain or returned in the provider response)
  </ParamField>

  <ParamField path="usage_metadata" type="dict | None">
    The usage metadata of the message, which can contain token counts when available.
  </ParamField>

  <ParamField path="response_metadata" type="ResponseMetadata | None">
    The response metadata of the message.
  </ParamField>
</Accordion>

#### Tool calls

When models make [tool calls](/oss/python/langchain/models#tool-calling), they're included in the [`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage):

```python  theme={null}
from langchain.chat_models import init_chat_model

model = init_chat_model("gpt-5-nano")

def get_weather(location: str) -> str:
    """Get the weather at a location."""
    ...

model_with_tools = model.bind_tools([get_weather])
response = model_with_tools.invoke("What's the weather in Paris?")

for tool_call in response.tool_calls:
    print(f"Tool: {tool_call['name']}")
    print(f"Args: {tool_call['args']}")
    print(f"ID: {tool_call['id']}")
```

Other structured data, such as reasoning or citations, can also appear in message [content](/oss/python/langchain/messages#message-content).

#### Token usage

An [`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage) can hold token counts and other usage metadata in its [`usage_metadata`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.UsageMetadata) field:

```python  theme={null}
from langchain.chat_models import init_chat_model

model = init_chat_model("gpt-5-nano")

response = model.invoke("Hello!")
response.usage_metadata
```

```
{'input_tokens': 8,
 'output_tokens': 304,
 'total_tokens': 312,
 'input_token_details': {'audio': 0, 'cache_read': 0},
 'output_token_details': {'audio': 0, 'reasoning': 256}}
```

See [`UsageMetadata`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.UsageMetadata) for details.

#### Streaming and chunks

During streaming, you'll receive [`AIMessageChunk`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessageChunk) objects that can be combined into a full message object:

```python  theme={null}
chunks = []
full_message = None
for chunk in model.stream("Hi"):
    chunks.append(chunk)
    print(chunk.text)
    full_message = chunk if full_message is None else full_message + chunk
```

<Note>
  Learn more:

  * [Streaming tokens from chat models](/oss/python/langchain/models#stream)
  * [Streaming tokens and/or steps from agents](/oss/python/langchain/streaming)
</Note>

***

### Tool Message

For models that support [tool calling](/oss/python/langchain/models#tool-calling), AI messages can contain tool calls. Tool messages are used to pass the results of a single tool execution back to the model.

[Tools](/oss/python/langchain/tools) can generate [`ToolMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage) objects directly. Below, we show a simple example. Read more in the [tools guide](/oss/python/langchain/tools).

```python  theme={null}
from langchain.messages import AIMessage
from langchain.messages import ToolMessage

# After a model makes a tool call
# (Here, we demonstrate manually creating the messages for brevity)
ai_message = AIMessage(
    content=[],
    tool_calls=[{
        "name": "get_weather",
        "args": {"location": "San Francisco"},
        "id": "call_123"
    }]
)

# Execute tool and create result message
weather_result = "Sunny, 72°F"
tool_message = ToolMessage(
    content=weather_result,
    tool_call_id="call_123"  # Must match the call ID
)

# Continue conversation
messages = [
    HumanMessage("What's the weather in San Francisco?"),
    ai_message,  # Model's tool call
    tool_message,  # Tool execution result
]
response = model.invoke(messages)  # Model processes the result
```

<Accordion title="Attributes">
  <ParamField path="content" type="string" required>
    The stringified output of the tool call.
  </ParamField>

  <ParamField path="tool_call_id" type="string" required>
    The ID of the tool call that this message is responding to. Must match the ID of the tool call in the [`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage).
  </ParamField>

  <ParamField path="name" type="string" required>
    The name of the tool that was called.
  </ParamField>

  <ParamField path="artifact" type="dict">
    Additional data not sent to the model but can be accessed programmatically.
  </ParamField>
</Accordion>

<Note>
  The `artifact` field stores supplementary data that won't be sent to the model but can be accessed programmatically. This is useful for storing raw results, debugging information, or data for downstream processing without cluttering the model's context.

  <Accordion title="Example: Using artifact for retrieval metadata">
    For example, a [retrieval](/oss/python/langchain/retrieval) tool could retrieve a passage from a document for reference by a model. Where message `content` contains text that the model will reference, an `artifact` can contain document identifiers or other metadata that an application can use (e.g., to render a page). See example below:

    ```python  theme={null}
    from langchain.messages import ToolMessage

    # Sent to model
    message_content = "It was the best of times, it was the worst of times."

    # Artifact available downstream
    artifact = {"document_id": "doc_123", "page": 0}

    tool_message = ToolMessage(
        content=message_content,
        tool_call_id="call_123",
        name="search_books",
        artifact=artifact,
    )
    ```

    See the [RAG tutorial](/oss/python/langchain/rag) for an end-to-end example of building retrieval [agents](/oss/python/langchain/agents) with LangChain.
  </Accordion>
</Note>

***

## Message content

You can think of a message's content as the payload of data that gets sent to the model. Messages have a `content` attribute that is loosely-typed, supporting strings and lists of untyped objects (e.g., dictionaries). This allows support for provider-native structures directly in LangChain chat models, such as [multimodal](#multimodal) content and other data.

Separately, LangChain provides dedicated content types for text, reasoning, citations, multi-modal data, server-side tool calls, and other message content. See [content blocks](#standard-content-blocks) below.

LangChain chat models accept message content in the `content` attribute.

This may contain either:

1. A string
2. A list of content blocks in a provider-native format
3. A list of [LangChain's standard content blocks](#standard-content-blocks)

See below for an example using [multimodal](#multimodal) inputs:

```python  theme={null}
from langchain.messages import HumanMessage

# String content
human_message = HumanMessage("Hello, how are you?")

# Provider-native format (e.g., OpenAI)
human_message = HumanMessage(content=[
    {"type": "text", "text": "Hello, how are you?"},
    {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}}
])

# List of standard content blocks
human_message = HumanMessage(content_blocks=[
    {"type": "text", "text": "Hello, how are you?"},
    {"type": "image", "url": "https://example.com/image.jpg"},
])
```

<Tip>
  Specifying `content_blocks` when initializing a message will still populate message
  `content`, but provides a type-safe interface for doing so.
</Tip>

### Standard content blocks

LangChain provides a standard representation for message content that works across providers.

Message objects implement a `content_blocks` property that will lazily parse the `content` attribute into a standard, type-safe representation. For example, messages generated from [`ChatAnthropic`](/oss/python/integrations/chat/anthropic) or [`ChatOpenAI`](/oss/python/integrations/chat/openai) will include `thinking` or `reasoning` blocks in the format of the respective provider, but can be lazily parsed into a consistent [`ReasoningContentBlock`](#content-block-reference) representation:

<Tabs>
  <Tab title="Anthropic">
    ```python  theme={null}
    from langchain.messages import AIMessage

    message = AIMessage(
        content=[
            {"type": "thinking", "thinking": "...", "signature": "WaUjzkyp..."},
            {"type": "text", "text": "..."},
        ],
        response_metadata={"model_provider": "anthropic"}
    )
    message.content_blocks
    ```

    ```
    [{'type': 'reasoning',
      'reasoning': '...',
      'extras': {'signature': 'WaUjzkyp...'}},
     {'type': 'text', 'text': '...'}]
    ```
  </Tab>

  <Tab title="OpenAI">
    ```python  theme={null}
    from langchain.messages import AIMessage

    message = AIMessage(
        content=[
            {
                "type": "reasoning",
                "id": "rs_abc123",
                "summary": [
                    {"type": "summary_text", "text": "summary 1"},
                    {"type": "summary_text", "text": "summary 2"},
                ],
            },
            {"type": "text", "text": "...", "id": "msg_abc123"},
        ],
        response_metadata={"model_provider": "openai"}
    )
    message.content_blocks
    ```

    ```
    [{'type': 'reasoning', 'id': 'rs_abc123', 'reasoning': 'summary 1'},
     {'type': 'reasoning', 'id': 'rs_abc123', 'reasoning': 'summary 2'},
     {'type': 'text', 'text': '...', 'id': 'msg_abc123'}]
    ```
  </Tab>
</Tabs>

See the [integrations guides](/oss/python/integrations/providers/overview) to get started with the
inference provider of your choice.

<Note>
  **Serializing standard content**

  If an application outside of LangChain needs access to the standard content block
  representation, you can opt-in to storing content blocks in message content.

  To do this, you can set the `LC_OUTPUT_VERSION` environment variable to `v1`. Or,
  initialize any chat model with `output_version="v1"`:

  ```python  theme={null}
  from langchain.chat_models import init_chat_model

  model = init_chat_model("gpt-5-nano", output_version="v1")
  ```
</Note>

### Multimodal

**Multimodality** refers to the ability to work with data that comes in different
forms, such as text, audio, images, and video. LangChain includes standard types
for these data that can be used across providers.

[Chat models](/oss/python/langchain/models) can accept multimodal data as input and generate
it as output. Below we show short examples of input messages featuring multimodal data.

<Note>
  Extra keys can be included top-level in the content block or nested in `"extras": {"key": value}`.

  [OpenAI](/oss/python/integrations/chat/openai#pdfs) and [AWS Bedrock Converse](/oss/python/integrations/chat/bedrock),
  for example, require a filename for PDFs. See the [provider page](/oss/python/integrations/providers/overview)
  for your chosen model for specifics.
</Note>

<CodeGroup>
  ```python Image input theme={null}
  # From URL
  message = {
      "role": "user",
      "content": [
          {"type": "text", "text": "Describe the content of this image."},
          {"type": "image", "url": "https://example.com/path/to/image.jpg"},
      ]
  }

  # From base64 data
  message = {
      "role": "user",
      "content": [
          {"type": "text", "text": "Describe the content of this image."},
          {
              "type": "image",
              "base64": "AAAAIGZ0eXBtcDQyAAAAAGlzb21tcDQyAAACAGlzb2...",
              "mime_type": "image/jpeg",
          },
      ]
  }

  # From provider-managed File ID
  message = {
      "role": "user",
      "content": [
          {"type": "text", "text": "Describe the content of this image."},
          {"type": "image", "file_id": "file-abc123"},
      ]
  }
  ```

  ```python PDF document input theme={null}
  # From URL
  message = {
      "role": "user",
      "content": [
          {"type": "text", "text": "Describe the content of this document."},
          {"type": "file", "url": "https://example.com/path/to/document.pdf"},
      ]
  }

  # From base64 data
  message = {
      "role": "user",
      "content": [
          {"type": "text", "text": "Describe the content of this document."},
          {
              "type": "file",
              "base64": "AAAAIGZ0eXBtcDQyAAAAAGlzb21tcDQyAAACAGlzb2...",
              "mime_type": "application/pdf",
          },
      ]
  }

  # From provider-managed File ID
  message = {
      "role": "user",
      "content": [
          {"type": "text", "text": "Describe the content of this document."},
          {"type": "file", "file_id": "file-abc123"},
      ]
  }
  ```

  ```python Audio input theme={null}
  # From base64 data
  message = {
      "role": "user",
      "content": [
          {"type": "text", "text": "Describe the content of this audio."},
          {
              "type": "audio",
              "base64": "AAAAIGZ0eXBtcDQyAAAAAGlzb21tcDQyAAACAGlzb2...",
              "mime_type": "audio/wav",
          },
      ]
  }

  # From provider-managed File ID
  message = {
      "role": "user",
      "content": [
          {"type": "text", "text": "Describe the content of this audio."},
          {"type": "audio", "file_id": "file-abc123"},
      ]
  }
  ```

  ```python Video input theme={null}
  # From base64 data
  message = {
      "role": "user",
      "content": [
          {"type": "text", "text": "Describe the content of this video."},
          {
              "type": "video",
              "base64": "AAAAIGZ0eXBtcDQyAAAAAGlzb21tcDQyAAACAGlzb2...",
              "mime_type": "video/mp4",
          },
      ]
  }

  # From provider-managed File ID
  message = {
      "role": "user",
      "content": [
          {"type": "text", "text": "Describe the content of this video."},
          {"type": "video", "file_id": "file-abc123"},
      ]
  }
  ```
</CodeGroup>

<Warning>
  Not all models support all file types. Check the model provider's [reference](https://reference.langchain.com/python/integrations/) for supported formats and size limits.
</Warning>

### Content block reference

Content blocks are represented (either when creating a message or accessing the `content_blocks` property) as a list of typed dictionaries. Each item in the list must adhere to one of the following block types:

<AccordionGroup>
  <Accordion title="Core" icon="cube">
    <AccordionGroup>
      <Accordion title="TextContentBlock" icon="text">
        **Purpose:** Standard text output

        <ParamField body="type" type="string" required>
          Always `"text"`
        </ParamField>

        <ParamField body="text" type="string" required>
          The text content
        </ParamField>

        <ParamField body="annotations" type="object[]">
          List of annotations for the text
        </ParamField>

        <ParamField body="extras" type="object">
          Additional provider-specific data
        </ParamField>

        **Example:**

        ```python  theme={null}
        {
            "type": "text",
            "text": "Hello world",
            "annotations": []
        }
        ```
      </Accordion>

      <Accordion title="ReasoningContentBlock" icon="brain">
        **Purpose:** Model reasoning steps

        <ParamField body="type" type="string" required>
          Always `"reasoning"`
        </ParamField>

        <ParamField body="reasoning" type="string">
          The reasoning content
        </ParamField>

        <ParamField body="extras" type="object">
          Additional provider-specific data
        </ParamField>

        **Example:**

        ```python  theme={null}
        {
            "type": "reasoning",
            "reasoning": "The user is asking about...",
            "extras": {"signature": "abc123"},
        }
        ```
      </Accordion>
    </AccordionGroup>
  </Accordion>

  <Accordion title="Multimodal" icon="images">
    <AccordionGroup>
      <Accordion title="ImageContentBlock" icon="image">
        **Purpose:** Image data

        <ParamField body="type" type="string" required>
          Always `"image"`
        </ParamField>

        <ParamField body="url" type="string">
          URL pointing to the image location.
        </ParamField>

        <ParamField body="base64" type="string">
          Base64-encoded image data.
        </ParamField>

        <ParamField body="id" type="string">
          Reference ID to an externally stored image (e.g., in a provider's file system or in a bucket).
        </ParamField>

        <ParamField body="mime_type" type="string">
          Image [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml#image) (e.g., `image/jpeg`, `image/png`)
        </ParamField>
      </Accordion>

      <Accordion title="AudioContentBlock" icon="volume-high">
        **Purpose:** Audio data

        <ParamField body="type" type="string" required>
          Always `"audio"`
        </ParamField>

        <ParamField body="url" type="string">
          URL pointing to the audio location.
        </ParamField>

        <ParamField body="base64" type="string">
          Base64-encoded audio data.
        </ParamField>

        <ParamField body="id" type="string">
          Reference ID to an externally stored audio file (e.g., in a provider's file system or in a bucket).
        </ParamField>

        <ParamField body="mime_type" type="string">
          Audio [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml#audio) (e.g., `audio/mpeg`, `audio/wav`)
        </ParamField>
      </Accordion>

      <Accordion title="VideoContentBlock" icon="video">
        **Purpose:** Video data

        <ParamField body="type" type="string" required>
          Always `"video"`
        </ParamField>

        <ParamField body="url" type="string">
          URL pointing to the video location.
        </ParamField>

        <ParamField body="base64" type="string">
          Base64-encoded video data.
        </ParamField>

        <ParamField body="id" type="string">
          Reference ID to an externally stored video file (e.g., in a provider's file system or in a bucket).
        </ParamField>

        <ParamField body="mime_type" type="string">
          Video [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml#video) (e.g., `video/mp4`, `video/webm`)
        </ParamField>
      </Accordion>

      <Accordion title="FileContentBlock" icon="file">
        **Purpose:** Generic files (PDF, etc)

        <ParamField body="type" type="string" required>
          Always `"file"`
        </ParamField>

        <ParamField body="url" type="string">
          URL pointing to the file location.
        </ParamField>

        <ParamField body="base64" type="string">
          Base64-encoded file data.
        </ParamField>

        <ParamField body="id" type="string">
          Reference ID to an externally stored file (e.g., in a provider's file system or in a bucket).
        </ParamField>

        <ParamField body="mime_type" type="string">
          File [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml) (e.g., `application/pdf`)
        </ParamField>
      </Accordion>

      <Accordion title="PlainTextContentBlock" icon="align-left">
        **Purpose:** Document text (`.txt`, `.md`)

        <ParamField body="type" type="string" required>
          Always `"text-plain"`
        </ParamField>

        <ParamField body="text" type="string">
          The text content
        </ParamField>

        <ParamField body="mime_type" type="string">
          [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml) of the text (e.g., `text/plain`, `text/markdown`)
        </ParamField>
      </Accordion>
    </AccordionGroup>
  </Accordion>

  <Accordion title="Tool Calling" icon="wrench">
    <AccordionGroup>
      <Accordion title="ToolCall" icon="function">
        **Purpose:** Function calls

        <ParamField body="type" type="string" required>
          Always `"tool_call"`
        </ParamField>

        <ParamField body="name" type="string" required>
          Name of the tool to call
        </ParamField>

        <ParamField body="args" type="object" required>
          Arguments to pass to the tool
        </ParamField>

        <ParamField body="id" type="string" required>
          Unique identifier for this tool call
        </ParamField>

        **Example:**

        ```python  theme={null}
        {
            "type": "tool_call",
            "name": "search",
            "args": {"query": "weather"},
            "id": "call_123"
        }
        ```
      </Accordion>

      <Accordion title="ToolCallChunk" icon="puzzle-piece">
        **Purpose:** Streaming tool call fragments

        <ParamField body="type" type="string" required>
          Always `"tool_call_chunk"`
        </ParamField>

        <ParamField body="name" type="string">
          Name of the tool being called
        </ParamField>

        <ParamField body="args" type="string">
          Partial tool arguments (may be incomplete JSON)
        </ParamField>

        <ParamField body="id" type="string">
          Tool call identifier
        </ParamField>

        <ParamField body="index" type="number | string">
          Position of this chunk in the stream
        </ParamField>
      </Accordion>

      <Accordion title="InvalidToolCall" icon="triangle-exclamation">
        **Purpose:** Malformed calls, intended to catch JSON parsing errors.

        <ParamField body="type" type="string" required>
          Always `"invalid_tool_call"`
        </ParamField>

        <ParamField body="name" type="string">
          Name of the tool that failed to be called
        </ParamField>

        <ParamField body="args" type="object">
          Arguments to pass to the tool
        </ParamField>

        <ParamField body="error" type="string">
          Description of what went wrong
        </ParamField>
      </Accordion>
    </AccordionGroup>
  </Accordion>

  <Accordion title="Server-Side Tool Execution" icon="server">
    <AccordionGroup>
      <Accordion title="ServerToolCall" icon="wrench">
        **Purpose:** Tool call that is executed server-side.

        <ParamField body="type" type="string" required>
          Always `"server_tool_call"`
        </ParamField>

        <ParamField body="id" type="string" required>
          An identifier associated with the tool call.
        </ParamField>

        <ParamField body="name" type="string" required>
          The name of the tool to be called.
        </ParamField>

        <ParamField body="args" type="string" required>
          Partial tool arguments (may be incomplete JSON)
        </ParamField>
      </Accordion>

      <Accordion title="ServerToolCallChunk" icon="puzzle-piece">
        **Purpose:** Streaming server-side tool call fragments

        <ParamField body="type" type="string" required>
          Always `"server_tool_call_chunk"`
        </ParamField>

        <ParamField body="id" type="string">
          An identifier associated with the tool call.
        </ParamField>

        <ParamField body="name" type="string">
          Name of the tool being called
        </ParamField>

        <ParamField body="args" type="string">
          Partial tool arguments (may be incomplete JSON)
        </ParamField>

        <ParamField body="index" type="number | string">
          Position of this chunk in the stream
        </ParamField>
      </Accordion>

      <Accordion title="ServerToolResult" icon="box-open">
        **Purpose:** Search results

        <ParamField body="type" type="string" required>
          Always `"server_tool_result"`
        </ParamField>

        <ParamField body="tool_call_id" type="string" required>
          Identifier of the corresponding server tool call.
        </ParamField>

        <ParamField body="id" type="string">
          Identifier associated with the server tool result.
        </ParamField>

        <ParamField body="status" type="string" required>
          Execution status of the server-side tool. `"success"` or `"error"`.
        </ParamField>

        <ParamField body="output">
          Output of the executed tool.
        </ParamField>
      </Accordion>
    </AccordionGroup>
  </Accordion>

  <Accordion title="Provider-Specific Blocks" icon="plug">
    <Accordion title="NonStandardContentBlock" icon="asterisk">
      **Purpose:** Provider-specific escape hatch

      <ParamField body="type" type="string" required>
        Always `"non_standard"`
      </ParamField>

      <ParamField body="value" type="object" required>
        Provider-specific data structure
      </ParamField>

      **Usage:** For experimental or provider-unique features
    </Accordion>

    Additional provider-specific content types may be found within the [reference documentation](/oss/python/integrations/providers/overview) of each model provider.
  </Accordion>
</AccordionGroup>

<Tip>
  View the canonical type definitions in the [API reference](https://reference.langchain.com/python/langchain/messages).
</Tip>

<Info>
  Content blocks were introduced as a new property on messages in LangChain v1 to standardize content formats across providers while maintaining backward compatibility with existing code.

  Content blocks are not a replacement for the [`content`](https://reference.langchain.com/python/langchain_core/language_models/#langchain_core.messages.BaseMessage.content) property, but rather a new property that can be used to access the content of a message in a standardized format.
</Info>

## Use with chat models

[Chat models](/oss/python/langchain/models) accept a sequence of message objects as input and return an [`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage) as output. Interactions are often stateless, so that a simple conversational loop involves invoking a model with a growing list of messages.

Refer to the below guides to learn more:

* Built-in features for [persisting and managing conversation histories](/oss/python/langchain/short-term-memory)
* Strategies for managing context windows, including [trimming and summarizing messages](/oss/python/langchain/short-term-memory#common-patterns)

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/messages.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt



---------------------------------https://docs.langchain.com/oss/python/langchain/tools---------------------------------https://docs.langchain.com/oss/python/langchain/tools---------------------------------https://docs.langchain.com/oss/python/langchain/tools---------------------------------https://docs.langchain.com/oss/python/langchain/tools---------------------------------https://docs.langchain.com/oss/python/langchain/tools---------------------------------https://docs.langchain.com/oss/python/langchain/tools



# Tools

Many AI applications interact with users via natural language. However, some use cases require models to interface directly with external systems—such as APIs, databases, or file systems—using structured input.

Tools are components that [agents](/oss/python/langchain/agents) call to perform actions. They extend model capabilities by letting them interact with the world through well-defined inputs and outputs.

Tools encapsulate a callable function and its input schema. These can be passed to compatible [chat models](/oss/python/langchain/models), allowing the model to decide whether to invoke a tool and with what arguments. In these scenarios, tool calling enables models to generate requests that conform to a specified input schema.

<Note>
  **Server-side tool use**

  Some chat models (e.g., [OpenAI](/oss/python/integrations/chat/openai), [Anthropic](/oss/python/integrations/chat/anthropic), and [Gemini](/oss/python/integrations/chat/google_generative_ai)) feature [built-in tools](/oss/python/langchain/models#server-side-tool-use) that are executed server-side, such as web search and code interpreters. Refer to the [provider overview](/oss/python/integrations/providers/overview) to learn how to access these tools with your specific chat model.
</Note>

## Create tools

### Basic tool definition

The simplest way to create a tool is with the [`@tool`](https://reference.langchain.com/python/langchain/tools/#langchain.tools.tool) decorator. By default, the function's docstring becomes the tool's description that helps the model understand when to use it:

```python  theme={null}
from langchain.tools import tool

@tool
def search_database(query: str, limit: int = 10) -> str:
    """Search the customer database for records matching the query.

    Args:
        query: Search terms to look for
        limit: Maximum number of results to return
    """
    return f"Found {limit} results for '{query}'"
```

Type hints are **required** as they define the tool's input schema. The docstring should be informative and concise to help the model understand the tool's purpose.

### Customize tool properties

#### Custom tool name

By default, the tool name comes from the function name. Override it when you need something more descriptive:

```python  theme={null}
@tool("web_search")  # Custom name
def search(query: str) -> str:
    """Search the web for information."""
    return f"Results for: {query}"

print(search.name)  # web_search
```

#### Custom tool description

Override the auto-generated tool description for clearer model guidance:

```python  theme={null}
@tool("calculator", description="Performs arithmetic calculations. Use this for any math problems.")
def calc(expression: str) -> str:
    """Evaluate mathematical expressions."""
    return str(eval(expression))
```

### Advanced schema definition

Define complex inputs with Pydantic models or JSON schemas:

<CodeGroup>
  ```python Pydantic model theme={null}
  from pydantic import BaseModel, Field
  from typing import Literal

  class WeatherInput(BaseModel):
      """Input for weather queries."""
      location: str = Field(description="City name or coordinates")
      units: Literal["celsius", "fahrenheit"] = Field(
          default="celsius",
          description="Temperature unit preference"
      )
      include_forecast: bool = Field(
          default=False,
          description="Include 5-day forecast"
      )

  @tool(args_schema=WeatherInput)
  def get_weather(location: str, units: str = "celsius", include_forecast: bool = False) -> str:
      """Get current weather and optional forecast."""
      temp = 22 if units == "celsius" else 72
      result = f"Current weather in {location}: {temp} degrees {units[0].upper()}"
      if include_forecast:
          result += "\nNext 5 days: Sunny"
      return result
  ```

  ```python JSON Schema theme={null}
  weather_schema = {
      "type": "object",
      "properties": {
          "location": {"type": "string"},
          "units": {"type": "string"},
          "include_forecast": {"type": "boolean"}
      },
      "required": ["location", "units", "include_forecast"]
  }

  @tool(args_schema=weather_schema)
  def get_weather(location: str, units: str = "celsius", include_forecast: bool = False) -> str:
      """Get current weather and optional forecast."""
      temp = 22 if units == "celsius" else 72
      result = f"Current weather in {location}: {temp} degrees {units[0].upper()}"
      if include_forecast:
          result += "\nNext 5 days: Sunny"
      return result
  ```
</CodeGroup>

python

### Reserved argument names

The following parameter names are reserved and cannot be used as tool arguments. Using these names will cause runtime errors.

| Parameter name | Purpose                                                                |
| -------------- | ---------------------------------------------------------------------- |
| `config`       | Reserved for passing `RunnableConfig` to tools internally              |
| `runtime`      | Reserved for `ToolRuntime` parameter (accessing state, context, store) |

To access runtime information, use the [`ToolRuntime`](https://reference.langchain.com/python/langchain/tools/#langchain.tools.ToolRuntime) parameter instead of naming your own arguments `config` or `runtime`.
:::

## Accessing Context

<Info>
  **Why this matters:** Tools are most powerful when they can access agent state, runtime context, and long-term memory. This enables tools to make context-aware decisions, personalize responses, and maintain information across conversations.

  Runtime context provides a way to inject dependencies (like database connections, user IDs, or configuration) into your tools at runtime, making them more testable and reusable.
</Info>

Tools can access runtime information through the `ToolRuntime` parameter, which provides:

* **State** - Mutable data that flows through execution (e.g., messages, counters, custom fields)
* **Context** - Immutable configuration like user IDs, session details, or application-specific configuration
* **Store** - Persistent long-term memory across conversations
* **Stream Writer** - Stream custom updates as tools execute
* **Config** - `RunnableConfig` for the execution
* **Tool Call ID** - ID of the current tool call

```mermaid  theme={null}
graph LR
    %% Runtime Context
    subgraph "🔧 Tool Runtime Context"
        A[Tool Call] --> B[ToolRuntime]
        B --> C[State Access]
        B --> D[Context Access]
        B --> E[Store Access]
        B --> F[Stream Writer]
    end

    %% Available Resources
    subgraph "📊 Available Resources"
        C --> G[Messages]
        C --> H[Custom State]
        D --> I[User ID]
        D --> J[Session Info]
        E --> K[Long-term Memory]
        E --> L[User Preferences]
    end

    %% Tool Capabilities
    subgraph "⚡ Enhanced Tool Capabilities"
        M[Context-Aware Tools]
        N[Stateful Tools]
        O[Memory-Enabled Tools]
        P[Streaming Tools]
    end

    %% Connections
    G --> M
    H --> N
    I --> M
    J --> M
    K --> O
    L --> O
    F --> P
```

### `ToolRuntime`

Use `ToolRuntime` to access all runtime information in a single parameter. Simply add `runtime: ToolRuntime` to your tool signature, and it will be automatically injected without being exposed to the LLM.

<Info>
  **`ToolRuntime`**: A unified parameter that provides tools access to state, context, store, streaming, config, and tool call ID. This replaces the older pattern of using separate [`InjectedState`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.tool_node.InjectedState), [`InjectedStore`](https://reference.langchain.com/python/langgraph/agents/#langgraph.prebuilt.tool_node.InjectedStore), [`get_runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.get_runtime), and [`InjectedToolCallId`](https://reference.langchain.com/python/langchain/tools/#langchain.tools.InjectedToolCallId) annotations.

  The runtime automatically provides these capabilities to your tool functions without you having to pass them explicitly or use global state.
</Info>

**Accessing state:**

Tools can access the current graph state using `ToolRuntime`:

```python  theme={null}
from langchain.tools import tool, ToolRuntime

# Access the current conversation state
@tool
def summarize_conversation(
    runtime: ToolRuntime
) -> str:
    """Summarize the conversation so far."""
    messages = runtime.state["messages"]

    human_msgs = sum(1 for m in messages if m.__class__.__name__ == "HumanMessage")
    ai_msgs = sum(1 for m in messages if m.__class__.__name__ == "AIMessage")
    tool_msgs = sum(1 for m in messages if m.__class__.__name__ == "ToolMessage")

    return f"Conversation has {human_msgs} user messages, {ai_msgs} AI responses, and {tool_msgs} tool results"

# Access custom state fields
@tool
def get_user_preference(
    pref_name: str,
    runtime: ToolRuntime  # ToolRuntime parameter is not visible to the model
) -> str:
    """Get a user preference value."""
    preferences = runtime.state.get("user_preferences", {})
    return preferences.get(pref_name, "Not set")
```

<Warning>
  The `tool_runtime` parameter is hidden from the model. For the example above, the model only sees `pref_name` in the tool schema - `tool_runtime` is *not* included in the request.
</Warning>

**Updating state:**

Use [`Command`](https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command) to update the agent's state or control the graph's execution flow:

```python  theme={null}
from langgraph.types import Command
from langchain.messages import RemoveMessage
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langchain.tools import tool, ToolRuntime

# Update the conversation history by removing all messages
@tool
def clear_conversation() -> Command:
    """Clear the conversation history."""

    return Command(
        update={
            "messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES)],
        }
    )

# Update the user_name in the agent state
@tool
def update_user_name(
    new_name: str,
    runtime: ToolRuntime
) -> Command:
    """Update the user's name."""
    return Command(update={"user_name": new_name})
```

#### Context

Access immutable configuration and contextual data like user IDs, session details, or application-specific configuration through `runtime.context`.

Tools can access runtime context through `ToolRuntime`:

```python  theme={null}
from dataclasses import dataclass
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime


USER_DATABASE = {
    "user123": {
        "name": "Alice Johnson",
        "account_type": "Premium",
        "balance": 5000,
        "email": "alice@example.com"
    },
    "user456": {
        "name": "Bob Smith",
        "account_type": "Standard",
        "balance": 1200,
        "email": "bob@example.com"
    }
}

@dataclass
class UserContext:
    user_id: str

@tool
def get_account_info(runtime: ToolRuntime[UserContext]) -> str:
    """Get the current user's account information."""
    user_id = runtime.context.user_id

    if user_id in USER_DATABASE:
        user = USER_DATABASE[user_id]
        return f"Account holder: {user['name']}\nType: {user['account_type']}\nBalance: ${user['balance']}"
    return "User not found"

model = ChatOpenAI(model="gpt-4o")
agent = create_agent(
    model,
    tools=[get_account_info],
    context_schema=UserContext,
    system_prompt="You are a financial assistant."
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's my current balance?"}]},
    context=UserContext(user_id="user123")
)
```

#### Memory (Store)

Access persistent data across conversations using the store. The store is accessed via `runtime.store` and allows you to save and retrieve user-specific or application-specific data.

Tools can access and update the store through `ToolRuntime`:

```python expandable theme={null}
from typing import Any
from langgraph.store.memory import InMemoryStore
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime


# Access memory
@tool
def get_user_info(user_id: str, runtime: ToolRuntime) -> str:
    """Look up user info."""
    store = runtime.store
    user_info = store.get(("users",), user_id)
    return str(user_info.value) if user_info else "Unknown user"

# Update memory
@tool
def save_user_info(user_id: str, user_info: dict[str, Any], runtime: ToolRuntime) -> str:
    """Save user info."""
    store = runtime.store
    store.put(("users",), user_id, user_info)
    return "Successfully saved user info."

store = InMemoryStore()
agent = create_agent(
    model,
    tools=[get_user_info, save_user_info],
    store=store
)

# First session: save user info
agent.invoke({
    "messages": [{"role": "user", "content": "Save the following user: userid: abc123, name: Foo, age: 25, email: foo@langchain.dev"}]
})

# Second session: get user info
agent.invoke({
    "messages": [{"role": "user", "content": "Get user info for user with id 'abc123'"}]
})
# Here is the user info for user with ID "abc123":
# - Name: Foo
# - Age: 25
# - Email: foo@langchain.dev
```

#### Stream Writer

Stream custom updates from tools as they execute using `runtime.stream_writer`. This is useful for providing real-time feedback to users about what a tool is doing.

```python  theme={null}
from langchain.tools import tool, ToolRuntime

@tool
def get_weather(city: str, runtime: ToolRuntime) -> str:
    """Get weather for a given city."""
    writer = runtime.stream_writer

    # Stream custom updates as the tool executes
    writer(f"Looking up data for city: {city}")
    writer(f"Acquired data for city: {city}")

    return f"It's always sunny in {city}!"
```

<Note>
  If you use `runtime.stream_writer` inside your tool, the tool must be invoked within a LangGraph execution context. See [Streaming](/oss/python/langchain/streaming) for more details.
</Note>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/tools.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt




-------------------------------https://docs.langchain.com/oss/python/langchain/short-term-memory-------------------------------https://docs.langchain.com/oss/python/langchain/short-term-memory-------------------------------https://docs.langchain.com/oss/python/langchain/short-term-memory-------------------------------https://docs.langchain.com/oss/python/langchain/short-term-memory-------------------------------https://docs.langchain.com/oss/python/langchain/short-term-memory-------------------------------https://docs.langchain.com/oss/python/langchain/short-term-memory





# Short-term memory

## Overview

Memory is a system that remembers information about previous interactions. For AI agents, memory is crucial because it lets them remember previous interactions, learn from feedback, and adapt to user preferences. As agents tackle more complex tasks with numerous user interactions, this capability becomes essential for both efficiency and user satisfaction.

Short term memory lets your application remember previous interactions within a single thread or conversation.

<Note>
  A thread organizes multiple interactions in a session, similar to the way email groups messages in a single conversation.
</Note>

Conversation history is the most common form of short-term memory. Long conversations pose a challenge to today's LLMs; a full history may not fit inside an LLM's context window, resulting in an context loss or errors.

Even if your model supports the full context length, most LLMs still perform poorly over long contexts. They get "distracted" by stale or off-topic content, all while suffering from slower response times and higher costs.

Chat models accept context using [messages](/oss/python/langchain/messages), which include instructions (a system message) and inputs (human messages). In chat applications, messages alternate between human inputs and model responses, resulting in a list of messages that grows longer over time. Because context windows are limited, many applications can benefit from using techniques to remove or "forget" stale information.

## Usage

To add short-term memory (thread-level persistence) to an agent, you need to specify a `checkpointer` when creating an agent.

<Info>
  LangChain's agent manages short-term memory as a part of your agent's state.

  By storing these in the graph's state, the agent can access the full context for a given conversation while maintaining separation between different threads.

  State is persisted to a database (or memory) using a checkpointer so the thread can be resumed at any time.

  Short-term memory updates when the agent is invoked or a step (like a tool call) is completed, and the state is read at the start of each step.
</Info>

```python  theme={null}
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver  # [!code highlight]


agent = create_agent(
    "gpt-5",
    [get_user_info],
    checkpointer=InMemorySaver(),  # [!code highlight]
)

agent.invoke(
    {"messages": [{"role": "user", "content": "Hi! My name is Bob."}]},
    {"configurable": {"thread_id": "1"}},  # [!code highlight]
)
```

### In production

In production, use a checkpointer backed by a database:

```shell  theme={null}
pip install langgraph-checkpoint-postgres
```

```python  theme={null}
from langchain.agents import create_agent

from langgraph.checkpoint.postgres import PostgresSaver  # [!code highlight]


DB_URI = "postgresql://postgres:postgres@localhost:5442/postgres?sslmode=disable"
with PostgresSaver.from_conn_string(DB_URI) as checkpointer:
    checkpointer.setup() # auto create tables in PostgresSql
    agent = create_agent(
        "gpt-5",
        [get_user_info],
        checkpointer=checkpointer,  # [!code highlight]
    )
```

## Customizing agent memory

By default, agents use [`AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState) to manage short term memory, specifically the conversation history via a `messages` key.

You can extend [`AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState) to add additional fields. Custom state schemas are passed to [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) using the [`state_schema`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.AgentMiddleware.state_schema) parameter.

```python  theme={null}
from langchain.agents import create_agent, AgentState
from langgraph.checkpoint.memory import InMemorySaver


class CustomAgentState(AgentState):  # [!code highlight]
    user_id: str  # [!code highlight]
    preferences: dict  # [!code highlight]

agent = create_agent(
    "gpt-5",
    [get_user_info],
    state_schema=CustomAgentState,  # [!code highlight]
    checkpointer=InMemorySaver(),
)

# Custom state can be passed in invoke
result = agent.invoke(
    {
        "messages": [{"role": "user", "content": "Hello"}],
        "user_id": "user_123",  # [!code highlight]
        "preferences": {"theme": "dark"}  # [!code highlight]
    },
    {"configurable": {"thread_id": "1"}})
```

## Common patterns

With [short-term memory](#add-short-term-memory) enabled, long conversations can exceed the LLM's context window. Common solutions are:

<CardGroup cols={2}>
  <Card title="Trim messages" icon="scissors" href="#trim-messages" arrow>
    Remove first or last N messages (before calling LLM)
  </Card>

  <Card title="Delete messages" icon="trash" href="#delete-messages" arrow>
    Delete messages from LangGraph state permanently
  </Card>

  <Card title="Summarize messages" icon="layer-group" href="#summarize-messages" arrow>
    Summarize earlier messages in the history and replace them with a summary
  </Card>

  <Card title="Custom strategies" icon="gears">
    Custom strategies (e.g., message filtering, etc.)
  </Card>
</CardGroup>

This allows the agent to keep track of the conversation without exceeding the LLM's context window.

### Trim messages

Most LLMs have a maximum supported context window (denominated in tokens).

One way to decide when to truncate messages is to count the tokens in the message history and truncate whenever it approaches that limit. If you're using LangChain, you can use the trim messages utility and specify the number of tokens to keep from the list, as well as the `strategy` (e.g., keep the last `max_tokens`) to use for handling the boundary.

To trim message history in an agent, use the [`@before_model`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.before_model) middleware decorator:

```python  theme={null}
from langchain.messages import RemoveMessage
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import before_model
from langgraph.runtime import Runtime
from langchain_core.runnables import RunnableConfig
from typing import Any


@before_model
def trim_messages(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    """Keep only the last few messages to fit context window."""
    messages = state["messages"]

    if len(messages) <= 3:
        return None  # No changes needed

    first_msg = messages[0]
    recent_messages = messages[-3:] if len(messages) % 2 == 0 else messages[-4:]
    new_messages = [first_msg] + recent_messages

    return {
        "messages": [
            RemoveMessage(id=REMOVE_ALL_MESSAGES),
            *new_messages
        ]
    }

agent = create_agent(
    model,
    tools=tools,
    middleware=[trim_messages],
    checkpointer=InMemorySaver(),
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}

agent.invoke({"messages": "hi, my name is bob"}, config)
agent.invoke({"messages": "write a short poem about cats"}, config)
agent.invoke({"messages": "now do the same but for dogs"}, config)
final_response = agent.invoke({"messages": "what's my name?"}, config)

final_response["messages"][-1].pretty_print()
"""
================================== Ai Message ==================================

Your name is Bob. You told me that earlier.
If you'd like me to call you a nickname or use a different name, just say the word.
"""
```

### Delete messages

You can delete messages from the graph state to manage the message history.

This is useful when you want to remove specific messages or clear the entire message history.

To delete messages from the graph state, you can use the `RemoveMessage`.

For `RemoveMessage` to work, you need to use a state key with [`add_messages`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.message.add_messages) [reducer](/oss/python/langgraph/graph-api#reducers).

The default [`AgentState`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.AgentState) provides this.

To remove specific messages:

```python  theme={null}
from langchain.messages import RemoveMessage  # [!code highlight]

def delete_messages(state):
    messages = state["messages"]
    if len(messages) > 2:
        # remove the earliest two messages
        return {"messages": [RemoveMessage(id=m.id) for m in messages[:2]]}  # [!code highlight]
```

To remove **all** messages:

```python  theme={null}
from langgraph.graph.message import REMOVE_ALL_MESSAGES  # [!code highlight]

def delete_messages(state):
    return {"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES)]}  # [!code highlight]
```

<Warning>
  When deleting messages, **make sure** that the resulting message history is valid. Check the limitations of the LLM provider you're using. For example:

  * Some providers expect message history to start with a `user` message
  * Most providers require `assistant` messages with tool calls to be followed by corresponding `tool` result messages.
</Warning>

```python  theme={null}
from langchain.messages import RemoveMessage
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import after_model
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.runtime import Runtime
from langchain_core.runnables import RunnableConfig


@after_model
def delete_old_messages(state: AgentState, runtime: Runtime) -> dict | None:
    """Remove old messages to keep conversation manageable."""
    messages = state["messages"]
    if len(messages) > 2:
        # remove the earliest two messages
        return {"messages": [RemoveMessage(id=m.id) for m in messages[:2]]}
    return None


agent = create_agent(
    "gpt-5-nano",
    tools=[],
    system_prompt="Please be concise and to the point.",
    middleware=[delete_old_messages],
    checkpointer=InMemorySaver(),
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}

for event in agent.stream(
    {"messages": [{"role": "user", "content": "hi! I'm bob"}]},
    config,
    stream_mode="values",
):
    print([(message.type, message.content) for message in event["messages"]])

for event in agent.stream(
    {"messages": [{"role": "user", "content": "what's my name?"}]},
    config,
    stream_mode="values",
):
    print([(message.type, message.content) for message in event["messages"]])
```

```
[('human', "hi! I'm bob")]
[('human', "hi! I'm bob"), ('ai', 'Hi Bob! Nice to meet you. How can I help you today? I can answer questions, brainstorm ideas, draft text, explain things, or help with code.')]
[('human', "hi! I'm bob"), ('ai', 'Hi Bob! Nice to meet you. How can I help you today? I can answer questions, brainstorm ideas, draft text, explain things, or help with code.'), ('human', "what's my name?")]
[('human', "hi! I'm bob"), ('ai', 'Hi Bob! Nice to meet you. How can I help you today? I can answer questions, brainstorm ideas, draft text, explain things, or help with code.'), ('human', "what's my name?"), ('ai', 'Your name is Bob. How can I help you today, Bob?')]
[('human', "what's my name?"), ('ai', 'Your name is Bob. How can I help you today, Bob?')]
```

### Summarize messages

The problem with trimming or removing messages, as shown above, is that you may lose information from culling of the message queue.
Because of this, some applications benefit from a more sophisticated approach of summarizing the message history using a chat model.

<img src="https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/summary.png?fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=c8ed3facdccd4ef5c7e52902c72ba938" alt="" data-og-width="609" width="609" data-og-height="242" height="242" data-path="oss/images/summary.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/summary.png?w=280&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=4208b9b0cc9f459f3dc4e5219918471b 280w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/summary.png?w=560&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=7acb77c081545f57042368f4e9d0c8cb 560w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/summary.png?w=840&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=2fcfdb0c481d2e1d361e76db763a41e5 840w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/summary.png?w=1100&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=4abdac693a562788aa0db8681bef8ea7 1100w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/summary.png?w=1650&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=40acfefa91dcb11b247a6e4a7705f22b 1650w, https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/summary.png?w=2500&fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=8d765aaf7551e8b0fc2720de7d2ac2a8 2500w" />

To summarize message history in an agent, use the built-in [`SummarizationMiddleware`](/oss/python/langchain/middleware#summarization):

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.runnables import RunnableConfig


checkpointer = InMemorySaver()

agent = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        SummarizationMiddleware(
            model="gpt-4o-mini",
            trigger={"tokens": 4000},
            keep={"messages": 20},
        )
    ],
    checkpointer=checkpointer,
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}
agent.invoke({"messages": "hi, my name is bob"}, config)
agent.invoke({"messages": "write a short poem about cats"}, config)
agent.invoke({"messages": "now do the same but for dogs"}, config)
final_response = agent.invoke({"messages": "what's my name?"}, config)

final_response["messages"][-1].pretty_print()
"""
================================== Ai Message ==================================

Your name is Bob!
"""
```

See [`SummarizationMiddleware`](/oss/python/langchain/middleware#summarization) for more configuration options.

## Access memory

You can access and modify the short-term memory (state) of an agent in several ways:

### Tools

#### Read short-term memory in a tool

Access short term memory (state) in a tool using the `ToolRuntime` parameter.

The `tool_runtime` parameter is hidden from the tool signature (so the model doesn't see it), but the tool can access the state through it.

```python  theme={null}
from langchain.agents import create_agent, AgentState
from langchain.tools import tool, ToolRuntime


class CustomState(AgentState):
    user_id: str

@tool
def get_user_info(
    runtime: ToolRuntime
) -> str:
    """Look up user info."""
    user_id = runtime.state["user_id"]
    return "User is John Smith" if user_id == "user_123" else "Unknown user"

agent = create_agent(
    model="gpt-5-nano",
    tools=[get_user_info],
    state_schema=CustomState,
)

result = agent.invoke({
    "messages": "look up user information",
    "user_id": "user_123"
})
print(result["messages"][-1].content)
# > User is John Smith.
```

#### Write short-term memory from tools

To modify the agent's short-term memory (state) during execution, you can return state updates directly from the tools.

This is useful for persisting intermediate results or making information accessible to subsequent tools or prompts.

```python  theme={null}
from langchain.tools import tool, ToolRuntime
from langchain_core.runnables import RunnableConfig
from langchain.messages import ToolMessage
from langchain.agents import create_agent, AgentState
from langgraph.types import Command
from pydantic import BaseModel


class CustomState(AgentState):  # [!code highlight]
    user_name: str

class CustomContext(BaseModel):
    user_id: str

@tool
def update_user_info(
    runtime: ToolRuntime[CustomContext, CustomState],
) -> Command:
    """Look up and update user info."""
    user_id = runtime.context.user_id
    name = "John Smith" if user_id == "user_123" else "Unknown user"
    return Command(update={  # [!code highlight]
        "user_name": name,
        # update the message history
        "messages": [
            ToolMessage(
                "Successfully looked up user information",
                tool_call_id=runtime.tool_call_id
            )
        ]
    })

@tool
def greet(
    runtime: ToolRuntime[CustomContext, CustomState]
) -> str | Command:
    """Use this to greet the user once you found their info."""
    user_name = runtime.state.get("user_name", None)
    if user_name is None:
       return Command(update={
            "messages": [
                ToolMessage(
                    "Please call the 'update_user_info' tool it will get and update the user's name.",
                    tool_call_id=runtime.tool_call_id
                )
            ]
        })
    return f"Hello {user_name}!"

agent = create_agent(
    model="gpt-5-nano",
    tools=[update_user_info, greet],
    state_schema=CustomState, # [!code highlight]
    context_schema=CustomContext,
)

agent.invoke(
    {"messages": [{"role": "user", "content": "greet the user"}]},
    context=CustomContext(user_id="user_123"),
)
```

### Prompt

Access short term memory (state) in middleware to create dynamic prompts based on conversation history or custom state fields.

```python  theme={null}
from langchain.agents import create_agent
from typing import TypedDict
from langchain.agents.middleware import dynamic_prompt, ModelRequest


class CustomContext(TypedDict):
    user_name: str


def get_weather(city: str) -> str:
    """Get the weather in a city."""
    return f"The weather in {city} is always sunny!"


@dynamic_prompt
def dynamic_system_prompt(request: ModelRequest) -> str:
    user_name = request.runtime.context["user_name"]
    system_prompt = f"You are a helpful assistant. Address the user as {user_name}."
    return system_prompt


agent = create_agent(
    model="gpt-5-nano",
    tools=[get_weather],
    middleware=[dynamic_system_prompt],
    context_schema=CustomContext,
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What is the weather in SF?"}]},
    context=CustomContext(user_name="John Smith"),
)
for msg in result["messages"]:
    msg.pretty_print()

```

```shell title="Output" theme={null}
================================ Human Message =================================

What is the weather in SF?
================================== Ai Message ==================================
Tool Calls:
  get_weather (call_WFQlOGn4b2yoJrv7cih342FG)
 Call ID: call_WFQlOGn4b2yoJrv7cih342FG
  Args:
    city: San Francisco
================================= Tool Message =================================
Name: get_weather

The weather in San Francisco is always sunny!
================================== Ai Message ==================================

Hi John Smith, the weather in San Francisco is always sunny!
```

### Before model

Access short term memory (state) in [`@before_model`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.before_model) middleware to process messages before model calls.

```mermaid  theme={null}
%%{
    init: {
        "fontFamily": "monospace",
        "flowchart": {
        "curve": "basis"
        },
        "themeVariables": {"edgeLabelBackground": "transparent"}
    }
}%%
graph TD
    S(["\_\_start\_\_"])
    PRE(before_model)
    MODEL(model)
    TOOLS(tools)
    END(["\_\_end\_\_"])
    S --> PRE
    PRE --> MODEL
    MODEL -.-> TOOLS
    MODEL -.-> END
    TOOLS --> PRE
    classDef blueHighlight fill:#0a1c25,stroke:#0a455f,color:#bae6fd;
    class S blueHighlight;
    class END blueHighlight;
```

```python  theme={null}
from langchain.messages import RemoveMessage
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import before_model
from langchain_core.runnables import RunnableConfig
from langgraph.runtime import Runtime
from typing import Any


@before_model
def trim_messages(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    """Keep only the last few messages to fit context window."""
    messages = state["messages"]

    if len(messages) <= 3:
        return None  # No changes needed

    first_msg = messages[0]
    recent_messages = messages[-3:] if len(messages) % 2 == 0 else messages[-4:]
    new_messages = [first_msg] + recent_messages

    return {
        "messages": [
            RemoveMessage(id=REMOVE_ALL_MESSAGES),
            *new_messages
        ]
    }


agent = create_agent(
    "gpt-5-nano",
    tools=[],
    middleware=[trim_messages],
    checkpointer=InMemorySaver()
)

config: RunnableConfig = {"configurable": {"thread_id": "1"}}

agent.invoke({"messages": "hi, my name is bob"}, config)
agent.invoke({"messages": "write a short poem about cats"}, config)
agent.invoke({"messages": "now do the same but for dogs"}, config)
final_response = agent.invoke({"messages": "what's my name?"}, config)

final_response["messages"][-1].pretty_print()
"""
================================== Ai Message ==================================

Your name is Bob. You told me that earlier.
If you'd like me to call you a nickname or use a different name, just say the word.
"""
```

### After model

Access short term memory (state) in [`@after_model`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.after_model) middleware to process messages after model calls.

```mermaid  theme={null}
%%{
    init: {
        "fontFamily": "monospace",
        "flowchart": {
        "curve": "basis"
        },
        "themeVariables": {"edgeLabelBackground": "transparent"}
    }
}%%
graph TD
    S(["\_\_start\_\_"])
    MODEL(model)
    POST(after_model)
    TOOLS(tools)
    END(["\_\_end\_\_"])
    S --> MODEL
    MODEL --> POST
    POST -.-> END
    POST -.-> TOOLS
    TOOLS --> MODEL
    classDef blueHighlight fill:#0a1c25,stroke:#0a455f,color:#bae6fd;
    class S blueHighlight;
    class END blueHighlight;
    class POST greenHighlight;
```

```python  theme={null}
from langchain.messages import RemoveMessage
from langgraph.checkpoint.memory import InMemorySaver
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import after_model
from langgraph.runtime import Runtime


@after_model
def validate_response(state: AgentState, runtime: Runtime) -> dict | None:
    """Remove messages containing sensitive words."""
    STOP_WORDS = ["password", "secret"]
    last_message = state["messages"][-1]
    if any(word in last_message.content for word in STOP_WORDS):
        return {"messages": [RemoveMessage(id=last_message.id)]}
    return None

agent = create_agent(
    model="gpt-5-nano",
    tools=[],
    middleware=[validate_response],
    checkpointer=InMemorySaver(),
)
```

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/short-term-memory.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt



-----------------------------------https://docs.langchain.com/oss/python/langchain/streaming-----------------------------------https://docs.langchain.com/oss/python/langchain/streaming-----------------------------------https://docs.langchain.com/oss/python/langchain/streaming-----------------------------------https://docs.langchain.com/oss/python/langchain/streaming-----------------------------------https://docs.langchain.com/oss/python/langchain/streaming-----------------------------------https://docs.langchain.com/oss/python/langchain/streaming

# Streaming

LangChain implements a streaming system to surface real-time updates.

Streaming is crucial for enhancing the responsiveness of applications built on LLMs. By displaying output progressively, even before a complete response is ready, streaming significantly improves user experience (UX), particularly when dealing with the latency of LLMs.

## Overview

LangChain's streaming system lets you surface live feedback from agent runs to your application.

What's possible with LangChain streaming:

* <Icon icon="brain" size={16} /> [**Stream agent progress**](#agent-progress) — get state updates after each agent step.
* <Icon icon="square-binary" size={16} /> [**Stream LLM tokens**](#llm-tokens) — stream language model tokens as they're generated.
* <Icon icon="table" size={16} /> [**Stream custom updates**](#custom-updates) — emit user-defined signals (e.g., `"Fetched 10/100 records"`).
* <Icon icon="layer-plus" size={16} /> [**Stream multiple modes**](#stream-multiple-modes) — choose from `updates` (agent progress), `messages` (LLM tokens + metadata), or `custom` (arbitrary user data).

## Agent progress

To stream agent progress, use the [`stream`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.stream) or [`astream`](https://reference.langchain.com/python/langgraph/graphs/#langgraph.graph.state.CompiledStateGraph.astream) methods with `stream_mode="updates"`. This emits an event after every agent step.

For example, if you have an agent that calls a tool once, you should see the following updates:

* **LLM node**: [`AIMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.AIMessage) with tool call requests
* **Tool node**: [`ToolMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage) with execution result
* **LLM node**: Final AI response

```python title="Streaming agent progress" theme={null}
from langchain.agents import create_agent


def get_weather(city: str) -> str:
    """Get weather for a given city."""

    return f"It's always sunny in {city}!"

agent = create_agent(
    model="gpt-5-nano",
    tools=[get_weather],
)
for chunk in agent.stream(  # [!code highlight]
    {"messages": [{"role": "user", "content": "What is the weather in SF?"}]},
    stream_mode="updates",
):
    for step, data in chunk.items():
        print(f"step: {step}")
        print(f"content: {data['messages'][-1].content_blocks}")
```

```shell title="Output" theme={null}
step: model
content: [{'type': 'tool_call', 'name': 'get_weather', 'args': {'city': 'San Francisco'}, 'id': 'call_OW2NYNsNSKhRZpjW0wm2Aszd'}]

step: tools
content: [{'type': 'text', 'text': "It's always sunny in San Francisco!"}]

step: model
content: [{'type': 'text', 'text': 'It's always sunny in San Francisco!'}]
```

## LLM tokens

To stream tokens as they are produced by the LLM, use `stream_mode="messages"`. Below you can see the output of the agent streaming tool calls and the final response.

```python title="Streaming LLM tokens" theme={null}
from langchain.agents import create_agent


def get_weather(city: str) -> str:
    """Get weather for a given city."""

    return f"It's always sunny in {city}!"

agent = create_agent(
    model="gpt-5-nano",
    tools=[get_weather],
)
for token, metadata in agent.stream(  # [!code highlight]
    {"messages": [{"role": "user", "content": "What is the weather in SF?"}]},
    stream_mode="messages",
):
    print(f"node: {metadata['langgraph_node']}")
    print(f"content: {token.content_blocks}")
    print("\n")
```

```shell title="Output" expandable theme={null}
node: model
content: [{'type': 'tool_call_chunk', 'id': 'call_vbCyBcP8VuneUzyYlSBZZsVa', 'name': 'get_weather', 'args': '', 'index': 0}]


node: model
content: [{'type': 'tool_call_chunk', 'id': None, 'name': None, 'args': '{"', 'index': 0}]


node: model
content: [{'type': 'tool_call_chunk', 'id': None, 'name': None, 'args': 'city', 'index': 0}]


node: model
content: [{'type': 'tool_call_chunk', 'id': None, 'name': None, 'args': '":"', 'index': 0}]


node: model
content: [{'type': 'tool_call_chunk', 'id': None, 'name': None, 'args': 'San', 'index': 0}]


node: model
content: [{'type': 'tool_call_chunk', 'id': None, 'name': None, 'args': ' Francisco', 'index': 0}]


node: model
content: [{'type': 'tool_call_chunk', 'id': None, 'name': None, 'args': '"}', 'index': 0}]


node: model
content: []


node: tools
content: [{'type': 'text', 'text': "It's always sunny in San Francisco!"}]


node: model
content: []


node: model
content: [{'type': 'text', 'text': 'Here'}]


node: model
content: [{'type': 'text', 'text': ''s'}]


node: model
content: [{'type': 'text', 'text': ' what'}]


node: model
content: [{'type': 'text', 'text': ' I'}]


node: model
content: [{'type': 'text', 'text': ' got'}]


node: model
content: [{'type': 'text', 'text': ':'}]


node: model
content: [{'type': 'text', 'text': ' "'}]


node: model
content: [{'type': 'text', 'text': "It's"}]


node: model
content: [{'type': 'text', 'text': ' always'}]


node: model
content: [{'type': 'text', 'text': ' sunny'}]


node: model
content: [{'type': 'text', 'text': ' in'}]


node: model
content: [{'type': 'text', 'text': ' San'}]


node: model
content: [{'type': 'text', 'text': ' Francisco'}]


node: model
content: [{'type': 'text', 'text': '!"\n\n'}]
```

## Custom updates

To stream updates from tools as they are executed, you can use [`get_stream_writer`](https://reference.langchain.com/python/langgraph/config/#langgraph.config.get_stream_writer).

```python title="Streaming custom updates" theme={null}
from langchain.agents import create_agent
from langgraph.config import get_stream_writer  # [!code highlight]


def get_weather(city: str) -> str:
    """Get weather for a given city."""
    writer = get_stream_writer()  # [!code highlight]
    # stream any arbitrary data
    writer(f"Looking up data for city: {city}")
    writer(f"Acquired data for city: {city}")
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[get_weather],
)

for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "What is the weather in SF?"}]},
    stream_mode="custom"  # [!code highlight]
):
    print(chunk)
```

```shell title="Output" theme={null}
Looking up data for city: San Francisco
Acquired data for city: San Francisco
```

<Note>
  If you add [`get_stream_writer`](https://reference.langchain.com/python/langgraph/config/#langgraph.config.get_stream_writer) inside your tool, you won't be able to invoke the tool outside of a LangGraph execution context.
</Note>

## Stream multiple modes

You can specify multiple streaming modes by passing stream mode as a list: `stream_mode=["updates", "custom"]`:

```python title="Streaming multiple modes" theme={null}
from langchain.agents import create_agent
from langgraph.config import get_stream_writer


def get_weather(city: str) -> str:
    """Get weather for a given city."""
    writer = get_stream_writer()
    writer(f"Looking up data for city: {city}")
    writer(f"Acquired data for city: {city}")
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="gpt-5-nano",
    tools=[get_weather],
)

for stream_mode, chunk in agent.stream(  # [!code highlight]
    {"messages": [{"role": "user", "content": "What is the weather in SF?"}]},
    stream_mode=["updates", "custom"]
):
    print(f"stream_mode: {stream_mode}")
    print(f"content: {chunk}")
    print("\n")
```

```shell title="Output" theme={null}
stream_mode: updates
content: {'model': {'messages': [AIMessage(content='', response_metadata={'token_usage': {'completion_tokens': 280, 'prompt_tokens': 132, 'total_tokens': 412, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 256, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_provider': 'openai', 'model_name': 'gpt-5-nano-2025-08-07', 'system_fingerprint': None, 'id': 'chatcmpl-C9tlgBzGEbedGYxZ0rTCz5F7OXpL7', 'service_tier': 'default', 'finish_reason': 'tool_calls', 'logprobs': None}, id='lc_run--480c07cb-e405-4411-aa7f-0520fddeed66-0', tool_calls=[{'name': 'get_weather', 'args': {'city': 'San Francisco'}, 'id': 'call_KTNQIftMrl9vgNwEfAJMVu7r', 'type': 'tool_call'}], usage_metadata={'input_tokens': 132, 'output_tokens': 280, 'total_tokens': 412, 'input_token_details': {'audio': 0, 'cache_read': 0}, 'output_token_details': {'audio': 0, 'reasoning': 256}})]}}


stream_mode: custom
content: Looking up data for city: San Francisco


stream_mode: custom
content: Acquired data for city: San Francisco


stream_mode: updates
content: {'tools': {'messages': [ToolMessage(content="It's always sunny in San Francisco!", name='get_weather', tool_call_id='call_KTNQIftMrl9vgNwEfAJMVu7r')]}}


stream_mode: updates
content: {'model': {'messages': [AIMessage(content='San Francisco weather: It's always sunny in San Francisco!\n\n', response_metadata={'token_usage': {'completion_tokens': 764, 'prompt_tokens': 168, 'total_tokens': 932, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 704, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_provider': 'openai', 'model_name': 'gpt-5-nano-2025-08-07', 'system_fingerprint': None, 'id': 'chatcmpl-C9tljDFVki1e1haCyikBptAuXuHYG', 'service_tier': 'default', 'finish_reason': 'stop', 'logprobs': None}, id='lc_run--acbc740a-18fe-4a14-8619-da92a0d0ee90-0', usage_metadata={'input_tokens': 168, 'output_tokens': 764, 'total_tokens': 932, 'input_token_details': {'audio': 0, 'cache_read': 0}, 'output_token_details': {'audio': 0, 'reasoning': 704}})]}}
```

## Disable streaming

In some applications you might need to disable streaming of individual tokens for a given model.

This is useful in [multi-agent](/oss/python/langchain/multi-agent) systems to control which agents stream their output.

See the [Models](/oss/python/langchain/models#disable-streaming) guide to learn how to disable streaming.

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/streaming.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


----------------------------------https://docs.langchain.com/oss/python/langchain/structured-output----------------------------------https://docs.langchain.com/oss/python/langchain/structured-output----------------------------------https://docs.langchain.com/oss/python/langchain/structured-output----------------------------------https://docs.langchain.com/oss/python/langchain/structured-output----------------------------------https://docs.langchain.com/oss/python/langchain/structured-output----------------------------------https://docs.langchain.com/oss/python/langchain/structured-output----------------------------------https://docs.langchain.com/oss/python/langchain/structured-output


# Structured output

Structured output allows agents to return data in a specific, predictable format. Instead of parsing natural language responses, you get structured data in the form of JSON objects, Pydantic models, or dataclasses that your application can directly use.

LangChain's [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) handles structured output automatically. The user sets their desired structured output schema, and when the model generates the structured data, it's captured, validated, and returned in the `'structured_response'` key of the agent's state.

```python  theme={null}
def create_agent(
    ...
    response_format: Union[
        ToolStrategy[StructuredResponseT],
        ProviderStrategy[StructuredResponseT],
        type[StructuredResponseT],
    ]
```

## Response Format

Controls how the agent returns structured data:

* **`ToolStrategy[StructuredResponseT]`**: Uses tool calling for structured output
* **`ProviderStrategy[StructuredResponseT]`**: Uses provider-native structured output
* **`type[StructuredResponseT]`**: Schema type - automatically selects best strategy based on model capabilities
* **`None`**: No structured output

When a schema type is provided directly, LangChain automatically chooses:

* `ProviderStrategy` for models supporting native structured output (e.g. [OpenAI](/oss/python/integrations/providers/openai), [Anthropic](/oss/python/integrations/providers/anthropic), or [Grok](/oss/python/integrations/providers/xai)).
* `ToolStrategy` for all other models.

<Tip>
  Support for native structured output features is read dynamically from the model's [profile data](/oss/python/langchain/models#model-profiles) if using `langchain>=1.1`. If data are not available, use another condition or specify manually:

  ```python  theme={null}
  custom_profile = {
      "structured_output": True,
      # ...
  }
  model = init_chat_model("...", profile=custom_profile)
  ```

  If tools are specified, the model must support simultaneous use of tools and structured output.
</Tip>

The structured response is returned in the `structured_response` key of the agent's final state.

## Provider strategy

Some model providers support structured output natively through their APIs (e.g. OpenAI, Grok, Gemini). This is the most reliable method when available.

To use this strategy, configure a `ProviderStrategy`:

```python  theme={null}
class ProviderStrategy(Generic[SchemaT]):
    schema: type[SchemaT]
```

<ParamField path="schema" required>
  The schema defining the structured output format. Supports:

  * **Pydantic models**: `BaseModel` subclasses with field validation
  * **Dataclasses**: Python dataclasses with type annotations
  * **TypedDict**: Typed dictionary classes
  * **JSON Schema**: Dictionary with JSON schema specification
</ParamField>

LangChain automatically uses `ProviderStrategy` when you pass a schema type directly to [`create_agent.response_format`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent\(response_format\)) and the model supports native structured output:

<CodeGroup>
  ```python Pydantic Model theme={null}
  from pydantic import BaseModel, Field
  from langchain.agents import create_agent


  class ContactInfo(BaseModel):
      """Contact information for a person."""
      name: str = Field(description="The name of the person")
      email: str = Field(description="The email address of the person")
      phone: str = Field(description="The phone number of the person")

  agent = create_agent(
      model="gpt-5",
      response_format=ContactInfo  # Auto-selects ProviderStrategy
  )

  result = agent.invoke({
      "messages": [{"role": "user", "content": "Extract contact info from: John Doe, john@example.com, (555) 123-4567"}]
  })

  print(result["structured_response"])
  # ContactInfo(name='John Doe', email='john@example.com', phone='(555) 123-4567')
  ```

  ```python Dataclass theme={null}
  from dataclasses import dataclass
  from langchain.agents import create_agent


  @dataclass
  class ContactInfo:
      """Contact information for a person."""
      name: str # The name of the person
      email: str # The email address of the person
      phone: str # The phone number of the person

  agent = create_agent(
      model="gpt-5",
      tools=tools,
      response_format=ContactInfo  # Auto-selects ProviderStrategy
  )

  result = agent.invoke({
      "messages": [{"role": "user", "content": "Extract contact info from: John Doe, john@example.com, (555) 123-4567"}]
  })

  result["structured_response"]
  # ContactInfo(name='John Doe', email='john@example.com', phone='(555) 123-4567')
  ```

  ```python TypedDict theme={null}
  from typing_extensions import TypedDict
  from langchain.agents import create_agent


  class ContactInfo(TypedDict):
      """Contact information for a person."""
      name: str # The name of the person
      email: str # The email address of the person
      phone: str # The phone number of the person

  agent = create_agent(
      model="gpt-5",
      tools=tools,
      response_format=ContactInfo  # Auto-selects ProviderStrategy
  )

  result = agent.invoke({
      "messages": [{"role": "user", "content": "Extract contact info from: John Doe, john@example.com, (555) 123-4567"}]
  })

  result["structured_response"]
  # {'name': 'John Doe', 'email': 'john@example.com', 'phone': '(555) 123-4567'}
  ```

  ```python JSON Schema theme={null}
  from langchain.agents import create_agent


  contact_info_schema = {
      "type": "object",
      "description": "Contact information for a person.",
      "properties": {
          "name": {"type": "string", "description": "The name of the person"},
          "email": {"type": "string", "description": "The email address of the person"},
          "phone": {"type": "string", "description": "The phone number of the person"}
      },
      "required": ["name", "email", "phone"]
  }

  agent = create_agent(
      model="gpt-5",
      tools=tools,
      response_format=ProviderStrategy(contact_info_schema)
  )

  result = agent.invoke({
      "messages": [{"role": "user", "content": "Extract contact info from: John Doe, john@example.com, (555) 123-4567"}]
  })

  result["structured_response"]
  # {'name': 'John Doe', 'email': 'john@example.com', 'phone': '(555) 123-4567'}
  ```
</CodeGroup>

Provider-native structured output provides high reliability and strict validation because the model provider enforces the schema. Use it when available.

<Note>
  If the provider natively supports structured output for your model choice, it is functionally equivalent to write `response_format=ProductReview` instead of `response_format=ProviderStrategy(ProductReview)`. In either case, if structured output is not supported, the agent will fall back to a tool calling strategy.
</Note>

## Tool calling strategy

For models that don't support native structured output, LangChain uses tool calling to achieve the same result. This works with all models that support tool calling, which is most modern models.

To use this strategy, configure a `ToolStrategy`:

```python  theme={null}
class ToolStrategy(Generic[SchemaT]):
    schema: type[SchemaT]
    tool_message_content: str | None
    handle_errors: Union[
        bool,
        str,
        type[Exception],
        tuple[type[Exception], ...],
        Callable[[Exception], str],
    ]
```

<ParamField path="schema" required>
  The schema defining the structured output format. Supports:

  * **Pydantic models**: `BaseModel` subclasses with field validation
  * **Dataclasses**: Python dataclasses with type annotations
  * **TypedDict**: Typed dictionary classes
  * **JSON Schema**: Dictionary with JSON schema specification
  * **Union types**: Multiple schema options. The model will choose the most appropriate schema based on the context.
</ParamField>

<ParamField path="tool_message_content">
  Custom content for the tool message returned when structured output is generated.
  If not provided, defaults to a message showing the structured response data.
</ParamField>

<ParamField path="handle_errors">
  Error handling strategy for structured output validation failures. Defaults to `True`.

  * **`True`**: Catch all errors with default error template
  * **`str`**: Catch all errors with this custom message
  * **`type[Exception]`**: Only catch this exception type with default message
  * **`tuple[type[Exception], ...]`**: Only catch these exception types with default message
  * **`Callable[[Exception], str]`**: Custom function that returns error message
  * **`False`**: No retry, let exceptions propagate
</ParamField>

<CodeGroup>
  ```python Pydantic Model theme={null}
  from pydantic import BaseModel, Field
  from typing import Literal
  from langchain.agents import create_agent
  from langchain.agents.structured_output import ToolStrategy


  class ProductReview(BaseModel):
      """Analysis of a product review."""
      rating: int | None = Field(description="The rating of the product", ge=1, le=5)
      sentiment: Literal["positive", "negative"] = Field(description="The sentiment of the review")
      key_points: list[str] = Field(description="The key points of the review. Lowercase, 1-3 words each.")

  agent = create_agent(
      model="gpt-5",
      tools=tools,
      response_format=ToolStrategy(ProductReview)
  )

  result = agent.invoke({
      "messages": [{"role": "user", "content": "Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'"}]
  })
  result["structured_response"]
  # ProductReview(rating=5, sentiment='positive', key_points=['fast shipping', 'expensive'])
  ```

  ```python Dataclass theme={null}
  from dataclasses import dataclass
  from typing import Literal
  from langchain.agents import create_agent
  from langchain.agents.structured_output import ToolStrategy


  @dataclass
  class ProductReview:
      """Analysis of a product review."""
      rating: int | None  # The rating of the product (1-5)
      sentiment: Literal["positive", "negative"]  # The sentiment of the review
      key_points: list[str]  # The key points of the review

  agent = create_agent(
      model="gpt-5",
      tools=tools,
      response_format=ToolStrategy(ProductReview)
  )

  result = agent.invoke({
      "messages": [{"role": "user", "content": "Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'"}]
  })
  result["structured_response"]
  # ProductReview(rating=5, sentiment='positive', key_points=['fast shipping', 'expensive'])
  ```

  ```python TypedDict theme={null}
  from typing import Literal
  from typing_extensions import TypedDict
  from langchain.agents import create_agent
  from langchain.agents.structured_output import ToolStrategy


  class ProductReview(TypedDict):
      """Analysis of a product review."""
      rating: int | None  # The rating of the product (1-5)
      sentiment: Literal["positive", "negative"]  # The sentiment of the review
      key_points: list[str]  # The key points of the review

  agent = create_agent(
      model="gpt-5",
      tools=tools,
      response_format=ToolStrategy(ProductReview)
  )

  result = agent.invoke({
      "messages": [{"role": "user", "content": "Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'"}]
  })
  result["structured_response"]
  # {'rating': 5, 'sentiment': 'positive', 'key_points': ['fast shipping', 'expensive']}
  ```

  ```python JSON Schema theme={null}
  from langchain.agents import create_agent
  from langchain.agents.structured_output import ToolStrategy


  product_review_schema = {
      "type": "object",
      "description": "Analysis of a product review.",
      "properties": {
          "rating": {
              "type": ["integer", "null"],
              "description": "The rating of the product (1-5)",
              "minimum": 1,
              "maximum": 5
          },
          "sentiment": {
              "type": "string",
              "enum": ["positive", "negative"],
              "description": "The sentiment of the review"
          },
          "key_points": {
              "type": "array",
              "items": {"type": "string"},
              "description": "The key points of the review"
          }
      },
      "required": ["sentiment", "key_points"]
  }

  agent = create_agent(
      model="gpt-5",
      tools=tools,
      response_format=ToolStrategy(product_review_schema)
  )

  result = agent.invoke({
      "messages": [{"role": "user", "content": "Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'"}]
  })
  result["structured_response"]
  # {'rating': 5, 'sentiment': 'positive', 'key_points': ['fast shipping', 'expensive']}
  ```

  ```python Union Types theme={null}
  from pydantic import BaseModel, Field
  from typing import Literal, Union
  from langchain.agents import create_agent
  from langchain.agents.structured_output import ToolStrategy


  class ProductReview(BaseModel):
      """Analysis of a product review."""
      rating: int | None = Field(description="The rating of the product", ge=1, le=5)
      sentiment: Literal["positive", "negative"] = Field(description="The sentiment of the review")
      key_points: list[str] = Field(description="The key points of the review. Lowercase, 1-3 words each.")

  class CustomerComplaint(BaseModel):
      """A customer complaint about a product or service."""
      issue_type: Literal["product", "service", "shipping", "billing"] = Field(description="The type of issue")
      severity: Literal["low", "medium", "high"] = Field(description="The severity of the complaint")
      description: str = Field(description="Brief description of the complaint")

  agent = create_agent(
      model="gpt-5",
      tools=tools,
      response_format=ToolStrategy(Union[ProductReview, CustomerComplaint])
  )

  result = agent.invoke({
      "messages": [{"role": "user", "content": "Analyze this review: 'Great product: 5 out of 5 stars. Fast shipping, but expensive'"}]
  })
  result["structured_response"]
  # ProductReview(rating=5, sentiment='positive', key_points=['fast shipping', 'expensive'])
  ```
</CodeGroup>

### Custom tool message content

The `tool_message_content` parameter allows you to customize the message that appears in the conversation history when structured output is generated:

```python  theme={null}
from pydantic import BaseModel, Field
from typing import Literal
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy


class MeetingAction(BaseModel):
    """Action items extracted from a meeting transcript."""
    task: str = Field(description="The specific task to be completed")
    assignee: str = Field(description="Person responsible for the task")
    priority: Literal["low", "medium", "high"] = Field(description="Priority level")

agent = create_agent(
    model="gpt-5",
    tools=[],
    response_format=ToolStrategy(
        schema=MeetingAction,
        tool_message_content="Action item captured and added to meeting notes!"
    )
)

agent.invoke({
    "messages": [{"role": "user", "content": "From our meeting: Sarah needs to update the project timeline as soon as possible"}]
})
```

```
================================ Human Message =================================

From our meeting: Sarah needs to update the project timeline as soon as possible
================================== Ai Message ==================================
Tool Calls:
  MeetingAction (call_1)
 Call ID: call_1
  Args:
    task: Update the project timeline
    assignee: Sarah
    priority: high
================================= Tool Message =================================
Name: MeetingAction

Action item captured and added to meeting notes!
```

Without `tool_message_content`, our final [`ToolMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage) would be:

```
================================= Tool Message =================================
Name: MeetingAction

Returning structured response: {'task': 'update the project timeline', 'assignee': 'Sarah', 'priority': 'high'}
```

### Error handling

Models can make mistakes when generating structured output via tool calling. LangChain provides intelligent retry mechanisms to handle these errors automatically.

#### Multiple structured outputs error

When a model incorrectly calls multiple structured output tools, the agent provides error feedback in a [`ToolMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage) and prompts the model to retry:

```python  theme={null}
from pydantic import BaseModel, Field
from typing import Union
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy


class ContactInfo(BaseModel):
    name: str = Field(description="Person's name")
    email: str = Field(description="Email address")

class EventDetails(BaseModel):
    event_name: str = Field(description="Name of the event")
    date: str = Field(description="Event date")

agent = create_agent(
    model="gpt-5",
    tools=[],
    response_format=ToolStrategy(Union[ContactInfo, EventDetails])  # Default: handle_errors=True
)

agent.invoke({
    "messages": [{"role": "user", "content": "Extract info: John Doe (john@email.com) is organizing Tech Conference on March 15th"}]
})
```

```
================================ Human Message =================================

Extract info: John Doe (john@email.com) is organizing Tech Conference on March 15th
None
================================== Ai Message ==================================
Tool Calls:
  ContactInfo (call_1)
 Call ID: call_1
  Args:
    name: John Doe
    email: john@email.com
  EventDetails (call_2)
 Call ID: call_2
  Args:
    event_name: Tech Conference
    date: March 15th
================================= Tool Message =================================
Name: ContactInfo

Error: Model incorrectly returned multiple structured responses (ContactInfo, EventDetails) when only one is expected.
 Please fix your mistakes.
================================= Tool Message =================================
Name: EventDetails

Error: Model incorrectly returned multiple structured responses (ContactInfo, EventDetails) when only one is expected.
 Please fix your mistakes.
================================== Ai Message ==================================
Tool Calls:
  ContactInfo (call_3)
 Call ID: call_3
  Args:
    name: John Doe
    email: john@email.com
================================= Tool Message =================================
Name: ContactInfo

Returning structured response: {'name': 'John Doe', 'email': 'john@email.com'}
```

#### Schema validation error

When structured output doesn't match the expected schema, the agent provides specific error feedback:

```python  theme={null}
from pydantic import BaseModel, Field
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy


class ProductRating(BaseModel):
    rating: int | None = Field(description="Rating from 1-5", ge=1, le=5)
    comment: str = Field(description="Review comment")

agent = create_agent(
    model="gpt-5",
    tools=[],
    response_format=ToolStrategy(ProductRating),  # Default: handle_errors=True
    system_prompt="You are a helpful assistant that parses product reviews. Do not make any field or value up."
)

agent.invoke({
    "messages": [{"role": "user", "content": "Parse this: Amazing product, 10/10!"}]
})
```

```
================================ Human Message =================================

Parse this: Amazing product, 10/10!
================================== Ai Message ==================================
Tool Calls:
  ProductRating (call_1)
 Call ID: call_1
  Args:
    rating: 10
    comment: Amazing product
================================= Tool Message =================================
Name: ProductRating

Error: Failed to parse structured output for tool 'ProductRating': 1 validation error for ProductRating.rating
  Input should be less than or equal to 5 [type=less_than_equal, input_value=10, input_type=int].
 Please fix your mistakes.
================================== Ai Message ==================================
Tool Calls:
  ProductRating (call_2)
 Call ID: call_2
  Args:
    rating: 5
    comment: Amazing product
================================= Tool Message =================================
Name: ProductRating

Returning structured response: {'rating': 5, 'comment': 'Amazing product'}
```

#### Error handling strategies

You can customize how errors are handled using the `handle_errors` parameter:

**Custom error message:**

```python  theme={null}
ToolStrategy(
    schema=ProductRating,
    handle_errors="Please provide a valid rating between 1-5 and include a comment."
)
```

If `handle_errors` is a string, the agent will *always* prompt the model to re-try with a fixed tool message:

```
================================= Tool Message =================================
Name: ProductRating

Please provide a valid rating between 1-5 and include a comment.
```

**Handle specific exceptions only:**

```python  theme={null}
ToolStrategy(
    schema=ProductRating,
    handle_errors=ValueError  # Only retry on ValueError, raise others
)
```

If `handle_errors` is an exception type, the agent will only retry (using the default error message) if the exception raised is the specified type. In all other cases, the exception will be raised.

**Handle multiple exception types:**

```python  theme={null}
ToolStrategy(
    schema=ProductRating,
    handle_errors=(ValueError, TypeError)  # Retry on ValueError and TypeError
)
```

If `handle_errors` is a tuple of exceptions, the agent will only retry (using the default error message) if the exception raised is one of the specified types. In all other cases, the exception will be raised.

**Custom error handler function:**

```python  theme={null}

from langchain.agents.structured_output import StructuredOutputValidationError
from langchain.agents.structured_output import MultipleStructuredOutputsError

def custom_error_handler(error: Exception) -> str:
    if isinstance(error, StructuredOutputValidationError):
        return "There was an issue with the format. Try again.
    elif isinstance(error, MultipleStructuredOutputsError):
        return "Multiple structured outputs were returned. Pick the most relevant one."
    else:
        return f"Error: {str(error)}"


agent = create_agent(
    model="gpt-5",
    tools=[],
    response_format=ToolStrategy(
                        schema=Union[ContactInfo, EventDetails],
                        handle_errors=custom_error_handler
                    )  # Default: handle_errors=True
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "Extract info: John Doe (john@email.com) is organizing Tech Conference on March 15th"}]
})

for msg in result['messages']:
    # If message is actually a ToolMessage object (not a dict), check its class name
    if type(msg).__name__ == "ToolMessage":
        print(msg.content)
    # If message is a dictionary or you want a fallback
    elif isinstance(msg, dict) and msg.get('tool_call_id'):
        print(msg['content'])

```

On `StructuredOutputValidationError`:

```
================================= Tool Message =================================
Name: ToolStrategy

There was an issue with the format. Try again.
```

On `MultipleStructuredOutputsError`:

```
================================= Tool Message =================================
Name: ToolStrategy

Multiple structured outputs were returned. Pick the most relevant one.
```

On other errors:

```
================================= Tool Message =================================
Name: ToolStrategy

Error: <error message>
```

**No error handling:**

```python  theme={null}
response_format = ToolStrategy(
    schema=ProductRating,
    handle_errors=False  # All errors raised
)
```

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/structured-output.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


-----------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/overview-----------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/overview-----------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/overview-----------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/overview-----------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/overview-----------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/overview


# Overview

> Control and customize agent execution at every step

Middleware provides a way to more tightly control what happens inside the agent. Middleware is useful for the following:

* Tracking agent behavior with logging, analytics, and debugging.
* Transforming prompts, [tool selection](/oss/python/langchain/middleware/built-in#llm-tool-selector), and output formatting.
* Adding [retries](/oss/python/langchain/middleware/built-in#tool-retry), [fallbacks](/oss/python/langchain/middleware/built-in#model-fallback), and early termination logic.
* Applying [rate limits](/oss/python/langchain/middleware/built-in#model-call-limit), guardrails, and [PII detection](/oss/python/langchain/middleware/built-in#pii-detection).

Add middleware by passing them to [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent):

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware, HumanInTheLoopMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[...],
    middleware=[
        SummarizationMiddleware(...),
        HumanInTheLoopMiddleware(...)
    ],
)
```

## The agent loop

The core agent loop involves calling a model, letting it choose tools to execute, and then finishing when it calls no more tools:

<img src="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=ac72e48317a9ced68fd1be64e89ec063" alt="Core agent loop diagram" style={{height: "200px", width: "auto", justifyContent: "center"}} className="rounded-lg block mx-auto" data-og-width="300" width="300" data-og-height="268" height="268" data-path="oss/images/core_agent_loop.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=280&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=a4c4b766b6678ef52a6ed556b1a0b032 280w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=560&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=111869e6e99a52c0eff60a1ef7ddc49c 560w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=840&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=6c1e21de7b53bd0a29683aca09c6f86e 840w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1100&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=88bef556edba9869b759551c610c60f4 1100w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1650&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=9b0bdd138e9548eeb5056dc0ed2d4a4b 1650w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=2500&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=41eb4f053ed5e6b0ba5bad2badf6d755 2500w" />

Middleware exposes hooks before and after each of those steps:

<img src="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=eb4404b137edec6f6f0c8ccb8323eaf1" alt="Middleware flow diagram" style={{height: "300px", width: "auto", justifyContent: "center"}} className="rounded-lg mx-auto" data-og-width="500" width="500" data-og-height="560" height="560" data-path="oss/images/middleware_final.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=280&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=483413aa87cf93323b0f47c0dd5528e8 280w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=560&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=41b7dd647447978ff776edafe5f42499 560w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=840&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=e9b14e264f68345de08ae76f032c52d4 840w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1100&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=ec45e1932d1279b1beee4a4b016b473f 1100w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1650&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=3bca5ebf8aa56632b8a9826f7f112e57 1650w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=2500&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=437f141d1266f08a95f030c2804691d9 2500w" />

## Additional resources

<CardGroup cols={2}>
  <Card title="Built-in middleware" icon="box" href="/oss/python/langchain/middleware/built-in">
    Explore built-in middleware for common use cases.
  </Card>

  <Card title="Custom middleware" icon="code" href="/oss/python/langchain/middleware/custom">
    Build your own middleware with hooks and decorators.
  </Card>

  <Card title="Middleware API reference" icon="book" href="https://reference.langchain.com/python/langchain/middleware/">
    Complete API reference for middleware.
  </Card>

  <Card title="Testing agents" icon="scale-unbalanced" href="/oss/python/langchain/test">
    Test your agents with LangSmith.
  </Card>
</CardGroup>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/middleware/overview.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


-------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/built-in-------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/built-in-------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/built-in-------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/built-in-------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/built-in-------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/built-in-------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/built-in



# Built-in middleware

> Prebuilt middleware for common agent use cases

LangChain provides prebuilt middleware for common use cases. Each middleware is production-ready and configurable for your specific needs.

## Provider-agnostic middleware

The following middleware work with any LLM provider:

| Middleware                              | Description                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------- |
| [Summarization](#summarization)         | Automatically summarize conversation history when approaching token limits. |
| [Human-in-the-loop](#human-in-the-loop) | Pause execution for human approval of tool calls.                           |
| [Model call limit](#model-call-limit)   | Limit the number of model calls to prevent excessive costs.                 |
| [Tool call limit](#tool-call-limit)     | Control tool execution by limiting call counts.                             |
| [Model fallback](#model-fallback)       | Automatically fallback to alternative models when primary fails.            |
| [PII detection](#pii-detection)         | Detect and handle Personally Identifiable Information (PII).                |
| [To-do list](#to-do-list)               | Equip agents with task planning and tracking capabilities.                  |
| [LLM tool selector](#llm-tool-selector) | Use an LLM to select relevant tools before calling main model.              |
| [Tool retry](#tool-retry)               | Automatically retry failed tool calls with exponential backoff.             |
| [Model retry](#model-retry)             | Automatically retry failed model calls with exponential backoff.            |
| [LLM tool emulator](#llm-tool-emulator) | Emulate tool execution using an LLM for testing purposes.                   |
| [Context editing](#context-editing)     | Manage conversation context by trimming or clearing tool uses.              |
| [Shell tool](#shell-tool)               | Expose a persistent shell session to agents for command execution.          |
| [File search](#file-search)             | Provide Glob and Grep search tools over filesystem files.                   |

### Summarization

Automatically summarize conversation history when approaching token limits, preserving recent messages while compressing older context. Summarization is useful for the following:

* Long-running conversations that exceed context windows.
* Multi-turn dialogues with extensive history.
* Applications where preserving full conversation context matters.

**API reference:** [`SummarizationMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.SummarizationMiddleware)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model="gpt-4o-mini",
            trigger={"tokens": 4000},
            keep={"messages": 20},
        ),
    ],
)
```

<Accordion title="Configuration options">
  <Tip>
    The `fraction` conditions for `trigger` and `keep` (shown below) rely on a chat model's [profile data](/oss/python/langchain/models#model-profiles) if using `langchain>=1.1`. If data are not available, use another condition or specify manually:

    ```python  theme={null}
    custom_profile = {
        "max_input_tokens": 100_000,
        # ...
    }
    model = init_chat_model("...", profile=custom_profile)
    ```
  </Tip>

  <ParamField body="model" type="string | BaseChatModel" required>
    Model for generating summaries. Can be a model identifier string (e.g., `'openai:gpt-4o-mini'`) or a `BaseChatModel` instance. See [`init_chat_model`](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model\(model\)) for more information.
  </ParamField>

  <ParamField body="trigger" type="dict | list[dict]">
    Conditions for triggering summarization. Can be:

    * A single condition dict (all properties must be met - AND logic)
    * A list of condition dicts (any condition must be met - OR logic)

    Each condition can include:

    * `fraction` (float): Fraction of model's context size (0-1)
    * `tokens` (int): Absolute token count
    * `messages` (int): Message count

    At least one property must be specified per condition. If not provided, summarization will not trigger automatically.
  </ParamField>

  <ParamField body="keep" type="dict" default="{messages: 20}">
    How much context to preserve after summarization. Specify exactly one of:

    * `fraction` (float): Fraction of model's context size to keep (0-1)
    * `tokens` (int): Absolute token count to keep
    * `messages` (int): Number of recent messages to keep
  </ParamField>

  <ParamField body="token_counter" type="function">
    Custom token counting function. Defaults to character-based counting.
  </ParamField>

  <ParamField body="summary_prompt" type="string">
    Custom prompt template for summarization. Uses built-in template if not specified. The template should include `{messages}` placeholder where conversation history will be inserted.
  </ParamField>

  <ParamField body="trim_tokens_to_summarize" type="number" default="4000">
    Maximum number of tokens to include when generating the summary. Messages will be trimmed to fit this limit before summarization.
  </ParamField>

  <ParamField body="summary_prefix" type="string">
    Prefix to add to the summary message. If not provided, a default prefix is used.
  </ParamField>

  <ParamField body="max_tokens_before_summary" type="number" deprecated>
    **Deprecated:** Use `trigger: {"tokens": value}` instead. Token threshold for triggering summarization.
  </ParamField>

  <ParamField body="messages_to_keep" type="number" deprecated>
    **Deprecated:** Use `keep: {"messages": value}` instead. Recent messages to preserve.
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The summarization middleware monitors message token counts and automatically summarizes older messages when thresholds are reached.

  **Trigger conditions** control when summarization runs:

  * Single condition object (all properties must be met - AND logic)
  * Array of conditions (any condition must be met - OR logic)
  * Each condition can use `fraction` (of model's context size), `tokens` (absolute count), or `messages` (message count)

  **Keep conditions** control how much context to preserve (specify exactly one):

  * `fraction` - Fraction of model's context size to keep
  * `tokens` - Absolute token count to keep
  * `messages` - Number of recent messages to keep

  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.agents.middleware import SummarizationMiddleware


  # Single condition: trigger if tokens >= 4000 AND messages >= 10
  agent = create_agent(
      model="gpt-4o",
      tools=[weather_tool, calculator_tool],
      middleware=[
          SummarizationMiddleware(
              model="gpt-4o-mini",
              trigger={"tokens": 4000, "messages": 10},
              keep={"messages": 20},
          ),
      ],
  )

  # Multiple conditions
  agent2 = create_agent(
      model="gpt-4o",
      tools=[weather_tool, calculator_tool],
      middleware=[
          SummarizationMiddleware(
              model="gpt-4o-mini",
              trigger=[
                  {"tokens": 5000, "messages": 3},
                  {"tokens": 3000, "messages": 6},
              ],
              keep={"messages": 20},
          ),
      ],
  )

  # Using fractional limits
  agent3 = create_agent(
      model="gpt-4o",
      tools=[weather_tool, calculator_tool],
      middleware=[
          SummarizationMiddleware(
              model="gpt-4o-mini",
              trigger={"fraction": 0.8},
              keep={"fraction": 0.3},
          ),
      ],
  )
  ```
</Accordion>

### Human-in-the-loop

Pause agent execution for human approval, editing, or rejection of tool calls before they execute. [Human-in-the-loop](/oss/python/langchain/human-in-the-loop) is useful for the following:

* High-stakes operations requiring human approval (e.g. database writes, financial transactions).
* Compliance workflows where human oversight is mandatory.
* Long-running conversations where human feedback guides the agent.

**API reference:** [`HumanInTheLoopMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.HumanInTheLoopMiddleware)

<Warning>
  Human-in-the-loop middleware requires a [checkpointer](/oss/python/langgraph/persistence#checkpoints) to maintain state across interruptions.
</Warning>

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    model="gpt-4o",
    tools=[read_email_tool, send_email_tool],
    checkpointer=InMemorySaver(),
    middleware=[
        HumanInTheLoopMiddleware(
            interrupt_on={
                "send_email_tool": {
                    "allowed_decisions": ["approve", "edit", "reject"],
                },
                "read_email_tool": False,
            }
        ),
    ],
)
```

<Tip>
  For complete examples, configuration options, and integration patterns, see the [Human-in-the-loop documentation](/oss/python/langchain/human-in-the-loop).
</Tip>

### Model call limit

Limit the number of model calls to prevent infinite loops or excessive costs. Model call limit is useful for the following:

* Preventing runaway agents from making too many API calls.
* Enforcing cost controls on production deployments.
* Testing agent behavior within specific call budgets.

**API reference:** [`ModelCallLimitMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelCallLimitMiddleware)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import ModelCallLimitMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[...],
    middleware=[
        ModelCallLimitMiddleware(
            thread_limit=10,
            run_limit=5,
            exit_behavior="end",
        ),
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="thread_limit" type="number">
    Maximum model calls across all runs in a thread. Defaults to no limit.
  </ParamField>

  <ParamField body="run_limit" type="number">
    Maximum model calls per single invocation. Defaults to no limit.
  </ParamField>

  <ParamField body="exit_behavior" type="string" default="end">
    Behavior when limit is reached. Options: `'end'` (graceful termination) or `'error'` (raise exception)
  </ParamField>
</Accordion>

### Tool call limit

Control agent execution by limiting the number of tool calls, either globally across all tools or for specific tools. Tool call limits are useful for the following:

* Preventing excessive calls to expensive external APIs.
* Limiting web searches or database queries.
* Enforcing rate limits on specific tool usage.
* Protecting against runaway agent loops.

**API reference:** [`ToolCallLimitMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ToolCallLimitMiddleware)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import ToolCallLimitMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, database_tool],
    middleware=[
        # Global limit
        ToolCallLimitMiddleware(thread_limit=20, run_limit=10),
        # Tool-specific limit
        ToolCallLimitMiddleware(
            tool_name="search",
            thread_limit=5,
            run_limit=3,
        ),
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="tool_name" type="string">
    Name of specific tool to limit. If not provided, limits apply to **all tools globally**.
  </ParamField>

  <ParamField body="thread_limit" type="number">
    Maximum tool calls across all runs in a thread (conversation). Persists across multiple invocations with the same thread ID. Requires a checkpointer to maintain state. `None` means no thread limit.
  </ParamField>

  <ParamField body="run_limit" type="number">
    Maximum tool calls per single invocation (one user message → response cycle). Resets with each new user message. `None` means no run limit.

    **Note:** At least one of `thread_limit` or `run_limit` must be specified.
  </ParamField>

  <ParamField body="exit_behavior" type="string" default="continue">
    Behavior when limit is reached:

    * `'continue'` (default) - Block exceeded tool calls with error messages, let other tools and the model continue. The model decides when to end based on the error messages.
    * `'error'` - Raise a `ToolCallLimitExceededError` exception, stopping execution immediately
    * `'end'` - Stop execution immediately with a `ToolMessage` and AI message for the exceeded tool call. Only works when limiting a single tool; raises `NotImplementedError` if other tools have pending calls.
  </ParamField>
</Accordion>

<Accordion title="Full example">
  Specify limits with:

  * **Thread limit** - Max calls across all runs in a conversation (requires checkpointer)
  * **Run limit** - Max calls per single invocation (resets each turn)

  Exit behaviors:

  * `'continue'` (default) - Block exceeded calls with error messages, agent continues
  * `'error'` - Raise exception immediately
  * `'end'` - Stop with ToolMessage + AI message (single-tool scenarios only)

  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.agents.middleware import ToolCallLimitMiddleware


  global_limiter = ToolCallLimitMiddleware(thread_limit=20, run_limit=10)
  search_limiter = ToolCallLimitMiddleware(tool_name="search", thread_limit=5, run_limit=3)
  database_limiter = ToolCallLimitMiddleware(tool_name="query_database", thread_limit=10)
  strict_limiter = ToolCallLimitMiddleware(tool_name="scrape_webpage", run_limit=2, exit_behavior="error")

  agent = create_agent(
      model="gpt-4o",
      tools=[search_tool, database_tool, scraper_tool],
      middleware=[global_limiter, search_limiter, database_limiter, strict_limiter],
  )
  ```
</Accordion>

### Model fallback

Automatically fallback to alternative models when the primary model fails. Model fallback is useful for the following:

* Building resilient agents that handle model outages.
* Cost optimization by falling back to cheaper models.
* Provider redundancy across OpenAI, Anthropic, etc.

**API reference:** [`ModelFallbackMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelFallbackMiddleware)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import ModelFallbackMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[...],
    middleware=[
        ModelFallbackMiddleware(
            "gpt-4o-mini",
            "claude-3-5-sonnet-20241022",
        ),
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="first_model" type="string | BaseChatModel" required>
    First fallback model to try when the primary model fails. Can be a model identifier string (e.g., `'openai:gpt-4o-mini'`) or a `BaseChatModel` instance.
  </ParamField>

  <ParamField body="*additional_models" type="string | BaseChatModel">
    Additional fallback models to try in order if previous models fail
  </ParamField>
</Accordion>

### PII detection

Detect and handle Personally Identifiable Information (PII) in conversations using configurable strategies. PII detection is useful for the following:

* Healthcare and financial applications with compliance requirements.
* Customer service agents that need to sanitize logs.
* Any application handling sensitive user data.

**API reference:** [`PIIMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.PIIMiddleware)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[...],
    middleware=[
        PIIMiddleware("email", strategy="redact", apply_to_input=True),
        PIIMiddleware("credit_card", strategy="mask", apply_to_input=True),
    ],
)
```

#### Custom PII types

You can create custom PII types by providing a `detector` parameter. This allows you to detect patterns specific to your use case beyond the built-in types.

**Three ways to create custom detectors:**

1. **Regex pattern string** - Simple pattern matching

2. **Custom function** - Complex detection logic with validation

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware
import re


# Method 1: Regex pattern string
agent1 = create_agent(
    model="gpt-4o",
    tools=[...],
    middleware=[
        PIIMiddleware(
            "api_key",
            detector=r"sk-[a-zA-Z0-9]{32}",
            strategy="block",
        ),
    ],
)

# Method 2: Compiled regex pattern
agent2 = create_agent(
    model="gpt-4o",
    tools=[...],
    middleware=[
        PIIMiddleware(
            "phone_number",
            detector=re.compile(r"\+?\d{1,3}[\s.-]?\d{3,4}[\s.-]?\d{4}"),
            strategy="mask",
        ),
    ],
)

# Method 3: Custom detector function
def detect_ssn(content: str) -> list[dict[str, str | int]]:
    """Detect SSN with validation.

    Returns a list of dictionaries with 'text', 'start', and 'end' keys.
    """
    import re
    matches = []
    pattern = r"\d{3}-\d{2}-\d{4}"
    for match in re.finditer(pattern, content):
        ssn = match.group(0)
        # Validate: first 3 digits shouldn't be 000, 666, or 900-999
        first_three = int(ssn[:3])
        if first_three not in [0, 666] and not (900 <= first_three <= 999):
            matches.append({
                "text": ssn,
                "start": match.start(),
                "end": match.end(),
            })
    return matches

agent3 = create_agent(
    model="gpt-4o",
    tools=[...],
    middleware=[
        PIIMiddleware(
            "ssn",
            detector=detect_ssn,
            strategy="hash",
        ),
    ],
)
```

**Custom detector function signature:**

The detector function must accept a string (content) and return matches:

Returns a list of dictionaries with `text`, `start`, and `end` keys:

```python  theme={null}
def detector(content: str) -> list[dict[str, str | int]]:
    return [
        {"text": "matched_text", "start": 0, "end": 12},
        # ... more matches
    ]
```

<Tip>
  For custom detectors:

  * Use regex strings for simple patterns
  * Use RegExp objects when you need flags (e.g., case-insensitive matching)
  * Use custom functions when you need validation logic beyond pattern matching
  * Custom functions give you full control over detection logic and can implement complex validation rules
</Tip>

<Accordion title="Configuration options">
  <ParamField body="pii_type" type="string" required>
    Type of PII to detect. Can be a built-in type (`email`, `credit_card`, `ip`, `mac_address`, `url`) or a custom type name.
  </ParamField>

  <ParamField body="strategy" type="string" default="redact">
    How to handle detected PII. Options:

    * `'block'` - Raise exception when detected
    * `'redact'` - Replace with `[REDACTED_TYPE]`
    * `'mask'` - Partially mask (e.g., `****-****-****-1234`)
    * `'hash'` - Replace with deterministic hash
  </ParamField>

  <ParamField body="detector" type="function | regex">
    Custom detector function or regex pattern. If not provided, uses built-in detector for the PII type.
  </ParamField>

  <ParamField body="apply_to_input" type="boolean" default="True">
    Check user messages before model call
  </ParamField>

  <ParamField body="apply_to_output" type="boolean" default="False">
    Check AI messages after model call
  </ParamField>

  <ParamField body="apply_to_tool_results" type="boolean" default="False">
    Check tool result messages after execution
  </ParamField>
</Accordion>

### To-do list

Equip agents with task planning and tracking capabilities for complex multi-step tasks. To-do lists are useful for the following:

* Complex multi-step tasks requiring coordination across multiple tools.
* Long-running operations where progress visibility is important.

<Note>
  This middleware automatically provides agents with a `write_todos` tool and system prompts to guide effective task planning.
</Note>

**API reference:** [`TodoListMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.TodoListMiddleware)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import TodoListMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[read_file, write_file, run_tests],
    middleware=[TodoListMiddleware()],
)
```

<Accordion title="Configuration options">
  <ParamField body="system_prompt" type="string">
    Custom system prompt for guiding todo usage. Uses built-in prompt if not specified.
  </ParamField>

  <ParamField body="tool_description" type="string">
    Custom description for the `write_todos` tool. Uses built-in description if not specified.
  </ParamField>
</Accordion>

### LLM tool selector

Use an LLM to intelligently select relevant tools before calling the main model. LLM tool selectors are useful for the following:

* Agents with many tools (10+) where most aren't relevant per query.
* Reducing token usage by filtering irrelevant tools.
* Improving model focus and accuracy.

This middleware uses structured output to ask an LLM which tools are most relevant for the current query. The structured output schema defines the available tool names and descriptions. Model providers often add this structured output information to the system prompt behind the scenes.

**API reference:** [`LLMToolSelectorMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.LLMToolSelectorMiddleware)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import LLMToolSelectorMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[tool1, tool2, tool3, tool4, tool5, ...],
    middleware=[
        LLMToolSelectorMiddleware(
            model="gpt-4o-mini",
            max_tools=3,
            always_include=["search"],
        ),
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="model" type="string | BaseChatModel">
    Model for tool selection. Can be a model identifier string (e.g., `'openai:gpt-4o-mini'`) or a `BaseChatModel` instance. See [`init_chat_model`](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model\(model\)) for more information.

    Defaults to the agent's main model.
  </ParamField>

  <ParamField body="system_prompt" type="string">
    Instructions for the selection model. Uses built-in prompt if not specified.
  </ParamField>

  <ParamField body="max_tools" type="number">
    Maximum number of tools to select. If the model selects more, only the first max\_tools will be used. No limit if not specified.
  </ParamField>

  <ParamField body="always_include" type="list[string]">
    Tool names to always include regardless of selection. These do not count against the max\_tools limit.
  </ParamField>
</Accordion>

### Tool retry

Automatically retry failed tool calls with configurable exponential backoff. Tool retry is useful for the following:

* Handling transient failures in external API calls.
* Improving reliability of network-dependent tools.
* Building resilient agents that gracefully handle temporary errors.

**API reference:** [`ToolRetryMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ToolRetryMiddleware)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import ToolRetryMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=3,
            backoff_factor=2.0,
            initial_delay=1.0,
        ),
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="max_retries" type="number" default="2">
    Maximum number of retry attempts after the initial call (3 total attempts with default)
  </ParamField>

  <ParamField body="tools" type="list[BaseTool | str]">
    Optional list of tools or tool names to apply retry logic to. If `None`, applies to all tools.
  </ParamField>

  <ParamField body="retry_on" type="tuple[type[Exception], ...] | callable" default="(Exception,)">
    Either a tuple of exception types to retry on, or a callable that takes an exception and returns `True` if it should be retried.
  </ParamField>

  <ParamField body="on_failure" type="string | callable" default="return_message">
    Behavior when all retries are exhausted. Options:

    * `'return_message'` - Return a `ToolMessage` with error details (allows LLM to handle failure)
    * `'raise'` - Re-raise the exception (stops agent execution)
    * Custom callable - Function that takes the exception and returns a string for the `ToolMessage` content
  </ParamField>

  <ParamField body="backoff_factor" type="number" default="2.0">
    Multiplier for exponential backoff. Each retry waits `initial_delay * (backoff_factor ** retry_number)` seconds. Set to `0.0` for constant delay.
  </ParamField>

  <ParamField body="initial_delay" type="number" default="1.0">
    Initial delay in seconds before first retry
  </ParamField>

  <ParamField body="max_delay" type="number" default="60.0">
    Maximum delay in seconds between retries (caps exponential backoff growth)
  </ParamField>

  <ParamField body="jitter" type="boolean" default="true">
    Whether to add random jitter (`±25%`) to delay to avoid thundering herd
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The middleware automatically retries failed tool calls with exponential backoff.

  **Key configuration:**

  * `max_retries` - Number of retry attempts (default: 2)
  * `backoff_factor` - Multiplier for exponential backoff (default: 2.0)
  * `initial_delay` - Starting delay in seconds (default: 1.0)
  * `max_delay` - Cap on delay growth (default: 60.0)
  * `jitter` - Add random variation (default: True)

  **Failure handling:**

  * `on_failure='return_message'` - Return error message
  * `on_failure='raise'` - Re-raise exception
  * Custom function - Function returning error message

  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.agents.middleware import ToolRetryMiddleware


  agent = create_agent(
      model="gpt-4o",
      tools=[search_tool, database_tool, api_tool],
      middleware=[
          ToolRetryMiddleware(
              max_retries=3,
              backoff_factor=2.0,
              initial_delay=1.0,
              max_delay=60.0,
              jitter=True,
              tools=["api_tool"],
              retry_on=(ConnectionError, TimeoutError),
              on_failure="return_message",
          ),
      ],
  )
  ```
</Accordion>

### Model retry

Automatically retry failed model calls with configurable exponential backoff. Model retry is useful for the following:

* Handling transient failures in model API calls.
* Improving reliability of network-dependent model requests.
* Building resilient agents that gracefully handle temporary model errors.

**API reference:** [`ModelRetryMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelRetryMiddleware)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import ModelRetryMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, database_tool],
    middleware=[
        ModelRetryMiddleware(
            max_retries=3,
            backoff_factor=2.0,
            initial_delay=1.0,
        ),
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="max_retries" type="number" default="2">
    Maximum number of retry attempts after the initial call (3 total attempts with default)
  </ParamField>

  <ParamField body="retry_on" type="tuple[type[Exception], ...] | callable" default="(Exception,)">
    Either a tuple of exception types to retry on, or a callable that takes an exception and returns `True` if it should be retried.
  </ParamField>

  <ParamField body="on_failure" type="string | callable" default="continue">
    Behavior when all retries are exhausted. Options:

    * `'continue'` (default) - Return an `AIMessage` with error details, allowing the agent to potentially handle the failure gracefully
    * `'error'` - Re-raise the exception (stops agent execution)
    * Custom callable - Function that takes the exception and returns a string for the `AIMessage` content
  </ParamField>

  <ParamField body="backoff_factor" type="number" default="2.0">
    Multiplier for exponential backoff. Each retry waits `initial_delay * (backoff_factor ** retry_number)` seconds. Set to `0.0` for constant delay.
  </ParamField>

  <ParamField body="initial_delay" type="number" default="1.0">
    Initial delay in seconds before first retry
  </ParamField>

  <ParamField body="max_delay" type="number" default="60.0">
    Maximum delay in seconds between retries (caps exponential backoff growth)
  </ParamField>

  <ParamField body="jitter" type="boolean" default="true">
    Whether to add random jitter (`±25%`) to delay to avoid thundering herd
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The middleware automatically retries failed model calls with exponential backoff.

  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.agents.middleware import ModelRetryMiddleware


  # Basic usage with default settings (2 retries, exponential backoff)
  agent = create_agent(
      model="gpt-4o",
      tools=[search_tool],
      middleware=[ModelRetryMiddleware()],
  )

  # Custom exception filtering
  class TimeoutError(Exception):
      """Custom exception for timeout errors."""
      pass

  class ConnectionError(Exception):
      """Custom exception for connection errors."""
      pass

  # Retry specific exceptions only
  retry = ModelRetryMiddleware(
      max_retries=4,
      retry_on=(TimeoutError, ConnectionError),
      backoff_factor=1.5,
  )


  def should_retry(error: Exception) -> bool:
      # Only retry on rate limit errors
      if isinstance(error, TimeoutError):
          return True
      # Or check for specific HTTP status codes
      if hasattr(error, "status_code"):
          return error.status_code in (429, 503)
      return False

  retry_with_filter = ModelRetryMiddleware(
      max_retries=3,
      retry_on=should_retry,
  )

  # Return error message instead of raising
  retry_continue = ModelRetryMiddleware(
      max_retries=4,
      on_failure="continue",  # Return AIMessage with error instead of raising
  )

  # Custom error message formatting
  def format_error(error: Exception) -> str:
      return f"Model call failed: {error}. Please try again later."

  retry_with_formatter = ModelRetryMiddleware(
      max_retries=4,
      on_failure=format_error,
  )

  # Constant backoff (no exponential growth)
  constant_backoff = ModelRetryMiddleware(
      max_retries=5,
      backoff_factor=0.0,  # No exponential growth
      initial_delay=2.0,  # Always wait 2 seconds
  )

  # Raise exception on failure
  strict_retry = ModelRetryMiddleware(
      max_retries=2,
      on_failure="error",  # Re-raise exception instead of returning message
  )
  ```
</Accordion>

### LLM tool emulator

Emulate tool execution using an LLM for testing purposes, replacing actual tool calls with AI-generated responses. LLM tool emulators are useful for the following:

* Testing agent behavior without executing real tools.
* Developing agents when external tools are unavailable or expensive.
* Prototyping agent workflows before implementing actual tools.

**API reference:** [`LLMToolEmulator`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.LLMToolEmulator)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import LLMToolEmulator

agent = create_agent(
    model="gpt-4o",
    tools=[get_weather, search_database, send_email],
    middleware=[
        LLMToolEmulator(),  # Emulate all tools
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="tools" type="list[str | BaseTool]">
    List of tool names (str) or BaseTool instances to emulate. If `None` (default), ALL tools will be emulated. If empty list `[]`, no tools will be emulated. If array with tool names/instances, only those tools will be emulated.
  </ParamField>

  <ParamField body="model" type="string | BaseChatModel">
    Model to use for generating emulated tool responses. Can be a model identifier string (e.g., `'anthropic:claude-sonnet-4-5-20250929'`) or a `BaseChatModel` instance. Defaults to the agent's model if not specified. See [`init_chat_model`](https://reference.langchain.com/python/langchain/models/#langchain.chat_models.init_chat_model\(model\)) for more information.
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The middleware uses an LLM to generate plausible responses for tool calls instead of executing the actual tools.

  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.agents.middleware import LLMToolEmulator
  from langchain.tools import tool


  @tool
  def get_weather(location: str) -> str:
      """Get the current weather for a location."""
      return f"Weather in {location}"

  @tool
  def send_email(to: str, subject: str, body: str) -> str:
      """Send an email."""
      return "Email sent"


  # Emulate all tools (default behavior)
  agent = create_agent(
      model="gpt-4o",
      tools=[get_weather, send_email],
      middleware=[LLMToolEmulator()],
  )

  # Emulate specific tools only
  agent2 = create_agent(
      model="gpt-4o",
      tools=[get_weather, send_email],
      middleware=[LLMToolEmulator(tools=["get_weather"])],
  )

  # Use custom model for emulation
  agent4 = create_agent(
      model="gpt-4o",
      tools=[get_weather, send_email],
      middleware=[LLMToolEmulator(model="anthropic:claude-sonnet-4-5-20250929")],
  )
  ```
</Accordion>

### Context editing

Manage conversation context by clearing older tool call outputs when token limits are reached, while preserving recent results. This helps keep context windows manageable in long conversations with many tool calls. Context editing is useful for the following:

* Long conversations with many tool calls that exceed token limits
* Reducing token costs by removing older tool outputs that are no longer relevant
* Maintaining only the most recent N tool results in context

**API reference:** [`ContextEditingMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ContextEditingMiddleware), [`ClearToolUsesEdit`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ClearToolUsesEdit)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import ContextEditingMiddleware, ClearToolUsesEdit

agent = create_agent(
    model="gpt-4o",
    tools=[...],
    middleware=[
        ContextEditingMiddleware(
            edits=[
                ClearToolUsesEdit(
                    trigger=100000,
                    keep=3,
                ),
            ],
        ),
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="edits" type="list[ContextEdit]" default="[ClearToolUsesEdit()]">
    List of [`ContextEdit`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ContextEdit) strategies to apply
  </ParamField>

  <ParamField body="token_count_method" type="string" default="approximate">
    Token counting method. Options: `'approximate'` or `'model'`
  </ParamField>

  **[`ClearToolUsesEdit`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ClearToolUsesEdit) options:**

  <ParamField body="trigger" type="number" default="100000">
    Token count that triggers the edit. When the conversation exceeds this token count, older tool outputs will be cleared.
  </ParamField>

  <ParamField body="clear_at_least" type="number" default="0">
    Minimum number of tokens to reclaim when the edit runs. If set to 0, clears as much as needed.
  </ParamField>

  <ParamField body="keep" type="number" default="3">
    Number of most recent tool results that must be preserved. These will never be cleared.
  </ParamField>

  <ParamField body="clear_tool_inputs" type="boolean" default="False">
    Whether to clear the originating tool call parameters on the AI message. When `True`, tool call arguments are replaced with empty objects.
  </ParamField>

  <ParamField body="exclude_tools" type="list[string]" default="()">
    List of tool names to exclude from clearing. These tools will never have their outputs cleared.
  </ParamField>

  <ParamField body="placeholder" type="string" default="[cleared]">
    Placeholder text inserted for cleared tool outputs. This replaces the original tool message content.
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The middleware applies context editing strategies when token limits are reached. The most common strategy is `ClearToolUsesEdit`, which clears older tool results while preserving recent ones.

  **How it works:**

  1. Monitor token count in conversation
  2. When threshold is reached, clear older tool outputs
  3. Keep most recent N tool results
  4. Optionally preserve tool call arguments for context

  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.agents.middleware import ContextEditingMiddleware, ClearToolUsesEdit


  agent = create_agent(
      model="gpt-4o",
      tools=[search_tool, calculator_tool, database_tool],
      middleware=[
          ContextEditingMiddleware(
              edits=[
                  ClearToolUsesEdit(
                      trigger=2000,
                      keep=3,
                      clear_tool_inputs=False,
                      exclude_tools=[],
                      placeholder="[cleared]",
                  ),
              ],
          ),
      ],
  )
  ```
</Accordion>

### Shell tool

Expose a persistent shell session to agents for command execution. Shell tool middleware is useful for the following:

* Agents that need to execute system commands
* Development and deployment automation tasks
* Testing and validation workflows
* File system operations and script execution

<Warning>
  **Security consideration**: Use appropriate execution policies (`HostExecutionPolicy`, `DockerExecutionPolicy`, or `CodexSandboxExecutionPolicy`) to match your deployment's security requirements.
</Warning>

<Note>
  **Limitation**: Persistent shell sessions do not currently work with interrupts (human-in-the-loop). We anticipate adding support for this in the future.
</Note>

**API reference:** [`ShellToolMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ShellToolMiddleware)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import (
    ShellToolMiddleware,
    HostExecutionPolicy,
)

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool],
    middleware=[
        ShellToolMiddleware(
            workspace_root="/workspace",
            execution_policy=HostExecutionPolicy(),
        ),
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="workspace_root" type="str | Path | None">
    Base directory for the shell session. If omitted, a temporary directory is created when the agent starts and removed when it ends.
  </ParamField>

  <ParamField body="startup_commands" type="tuple[str, ...] | list[str] | str | None">
    Optional commands executed sequentially after the session starts
  </ParamField>

  <ParamField body="shutdown_commands" type="tuple[str, ...] | list[str] | str | None">
    Optional commands executed before the session shuts down
  </ParamField>

  <ParamField body="execution_policy" type="BaseExecutionPolicy | None">
    Execution policy controlling timeouts, output limits, and resource configuration. Options:

    * `HostExecutionPolicy` - Full host access (default); best for trusted environments where the agent already runs inside a container or VM
    * `DockerExecutionPolicy` - Launches a separate Docker container for each agent run, providing harder isolation
    * `CodexSandboxExecutionPolicy` - Reuses the Codex CLI sandbox for additional syscall/filesystem restrictions
  </ParamField>

  <ParamField body="redaction_rules" type="tuple[RedactionRule, ...] | list[RedactionRule] | None">
    Optional redaction rules to sanitize command output before returning it to the model
  </ParamField>

  <ParamField body="tool_description" type="str | None">
    Optional override for the registered shell tool description
  </ParamField>

  <ParamField body="shell_command" type="Sequence[str] | str | None">
    Optional shell executable (string) or argument sequence used to launch the persistent session. Defaults to `/bin/bash`.
  </ParamField>

  <ParamField body="env" type="Mapping[str, Any] | None">
    Optional environment variables to supply to the shell session. Values are coerced to strings before command execution.
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The middleware provides a single persistent shell session that agents can use to execute commands sequentially.

  **Execution policies:**

  * `HostExecutionPolicy` (default) - Native execution with full host access
  * `DockerExecutionPolicy` - Isolated Docker container execution
  * `CodexSandboxExecutionPolicy` - Sandboxed execution via Codex CLI

  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.agents.middleware import (
      ShellToolMiddleware,
      HostExecutionPolicy,
      DockerExecutionPolicy,
      RedactionRule,
  )


  # Basic shell tool with host execution
  agent = create_agent(
      model="gpt-4o",
      tools=[search_tool],
      middleware=[
          ShellToolMiddleware(
              workspace_root="/workspace",
              execution_policy=HostExecutionPolicy(),
          ),
      ],
  )

  # Docker isolation with startup commands
  agent_docker = create_agent(
      model="gpt-4o",
      tools=[],
      middleware=[
          ShellToolMiddleware(
              workspace_root="/workspace",
              startup_commands=["pip install requests", "export PYTHONPATH=/workspace"],
              execution_policy=DockerExecutionPolicy(
                  image="python:3.11-slim",
                  command_timeout=60.0,
              ),
          ),
      ],
  )

  # With output redaction
  agent_redacted = create_agent(
      model="gpt-4o",
      tools=[],
      middleware=[
          ShellToolMiddleware(
              workspace_root="/workspace",
              redaction_rules=[
                  RedactionRule(pii_type="api_key", detector=r"sk-[a-zA-Z0-9]{32}"),
              ],
          ),
      ],
  )
  ```
</Accordion>

### File search

Provide Glob and Grep search tools over filesystem files. File search middleware is useful for the following:

* Code exploration and analysis
* Finding files by name patterns
* Searching code content with regex
* Large codebases where file discovery is needed

**API reference:** [`FilesystemFileSearchMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.FilesystemFileSearchMiddleware)

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import FilesystemFileSearchMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        FilesystemFileSearchMiddleware(
            root_path="/workspace",
            use_ripgrep=True,
        ),
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="root_path" type="str" required>
    Root directory to search. All file operations are relative to this path.
  </ParamField>

  <ParamField body="use_ripgrep" type="bool" default="True">
    Whether to use ripgrep for search. Falls back to Python regex if ripgrep is unavailable.
  </ParamField>

  <ParamField body="max_file_size_mb" type="int" default="10">
    Maximum file size to search in MB. Files larger than this are skipped.
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The middleware adds two search tools to agents:

  **Glob tool** - Fast file pattern matching:

  * Supports patterns like `**/*.py`, `src/**/*.ts`
  * Returns matching file paths sorted by modification time

  **Grep tool** - Content search with regex:

  * Full regex syntax support
  * Filter by file patterns with `include` parameter
  * Three output modes: `files_with_matches`, `content`, `count`

  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.agents.middleware import FilesystemFileSearchMiddleware
  from langchain.messages import HumanMessage


  agent = create_agent(
      model="gpt-4o",
      tools=[],
      middleware=[
          FilesystemFileSearchMiddleware(
              root_path="/workspace",
              use_ripgrep=True,
              max_file_size_mb=10,
          ),
      ],
  )

  # Agent can now use glob_search and grep_search tools
  result = agent.invoke({
      "messages": [HumanMessage("Find all Python files containing 'async def'")]
  })

  # The agent will use:
  # 1. glob_search(pattern="**/*.py") to find Python files
  # 2. grep_search(pattern="async def", include="*.py") to find async functions
  ```
</Accordion>

## Provider-specific middleware

These middleware are optimized for specific LLM providers.

### Anthropic

Middleware specifically designed for Anthropic's Claude models.

| Middleware                        | Description                                                    |
| --------------------------------- | -------------------------------------------------------------- |
| [Prompt caching](#prompt-caching) | Reduce costs by caching repetitive prompt prefixes             |
| [Bash tool](#bash-tool)           | Execute Claude's native bash tool with local command execution |
| [Text editor](#text-editor)       | Provide Claude's text editor tool for file editing             |
| [Memory](#memory)                 | Provide Claude's memory tool for persistent agent memory       |
| [File search](#file-search-1)     | Search tools for state-based file systems                      |

#### Prompt caching

Reduce costs and latency by caching static or repetitive prompt content (like system prompts, tool definitions, and conversation history) on Anthropic's servers. This middleware implements a **conversational caching strategy** that places cache breakpoints after the most recent message, allowing the entire conversation history (including the latest user message) to be cached and reused in subsequent API calls. Prompt caching is useful for the following:

* Applications with long, static system prompts that don't change between requests
* Agents with many tool definitions that remain constant across invocations
* Conversations where early message history is reused across multiple turns
* High-volume deployments where reducing API costs and latency is critical

<Info>
  Learn more about [Anthropic prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#cache-limitations) strategies and limitations.
</Info>

**API reference:** [`AnthropicPromptCachingMiddleware`](https://reference.langchain.com/python/integrations/langchain_anthropic/middleware/#langchain_anthropic.middleware.AnthropicPromptCachingMiddleware)

```python  theme={null}
from langchain_anthropic import ChatAnthropic
from langchain_anthropic.middleware import AnthropicPromptCachingMiddleware
from langchain.agents import create_agent

agent = create_agent(
    model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
    system_prompt="<Your long system prompt here>",
    middleware=[AnthropicPromptCachingMiddleware(ttl="5m")],
)
```

<Accordion title="Configuration options">
  <ParamField body="type" type="string" default="ephemeral">
    Cache type. Only `'ephemeral'` is currently supported.
  </ParamField>

  <ParamField body="ttl" type="string" default="5m">
    Time to live for cached content. Valid values: `'5m'` or `'1h'`
  </ParamField>

  <ParamField body="min_messages_to_cache" type="number" default="0">
    Minimum number of messages before caching starts
  </ParamField>

  <ParamField body="unsupported_model_behavior" type="string" default="warn">
    Behavior when using non-Anthropic models. Options: `'ignore'`, `'warn'`, or `'raise'`
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The middleware caches content up to and including the latest message in each request. On subsequent requests within the TTL window (5 minutes or 1 hour), previously seen content is retrieved from cache rather than reprocessed, significantly reducing costs and latency.

  **How it works:**

  1. First request: System prompt, tools, and the user message "Hi, my name is Bob" are sent to the API and cached
  2. Second request: The cached content (system prompt, tools, and first message) is retrieved from cache. Only the new message "What's my name?" needs to be processed, plus the model's response from the first request
  3. This pattern continues for each turn, with each request reusing the cached conversation history

  ```python  theme={null}
  from langchain_anthropic import ChatAnthropic
  from langchain_anthropic.middleware import AnthropicPromptCachingMiddleware
  from langchain.agents import create_agent
  from langchain.messages import HumanMessage


  LONG_PROMPT = """
  Please be a helpful assistant.

  <Lots more context ...>
  """

  agent = create_agent(
      model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
      system_prompt=LONG_PROMPT,
      middleware=[AnthropicPromptCachingMiddleware(ttl="5m")],
  )

  # First invocation: Creates cache with system prompt, tools, and "Hi, my name is Bob"
  agent.invoke({"messages": [HumanMessage("Hi, my name is Bob")]})

  # Second invocation: Reuses cached system prompt, tools, and previous messages
  # Only processes the new message "What's my name?" and the previous AI response
  agent.invoke({"messages": [HumanMessage("What's my name?")]})
  ```
</Accordion>

#### Bash tool

Execute Claude's native `bash_20250124` tool with local command execution. The bash tool middleware is useful for the following:

* Using Claude's built-in bash tool with local execution
* Leveraging Claude's optimized bash tool interface
* Agents that need persistent shell sessions with Anthropic models

<Info>
  This middleware wraps `ShellToolMiddleware` and exposes it as Claude's native bash tool.
</Info>

**API reference:** [`ClaudeBashToolMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ClaudeBashToolMiddleware)

```python  theme={null}
from langchain_anthropic import ChatAnthropic
from langchain_anthropic.middleware import ClaudeBashToolMiddleware
from langchain.agents import create_agent

agent = create_agent(
    model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
    tools=[],
    middleware=[
        ClaudeBashToolMiddleware(
            workspace_root="/workspace",
        ),
    ],
)
```

<Accordion title="Configuration options">
  `ClaudeBashToolMiddleware` accepts all parameters from [`ShellToolMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ShellToolMiddleware), including:

  <ParamField body="workspace_root" type="str | Path | None">
    Base directory for the shell session
  </ParamField>

  <ParamField body="startup_commands" type="tuple[str, ...] | list[str] | str | None">
    Commands to run when the session starts
  </ParamField>

  <ParamField body="execution_policy" type="BaseExecutionPolicy | None">
    Execution policy (`HostExecutionPolicy`, `DockerExecutionPolicy`, or `CodexSandboxExecutionPolicy`)
  </ParamField>

  <ParamField body="redaction_rules" type="tuple[RedactionRule, ...] | list[RedactionRule] | None">
    Rules for sanitizing command output
  </ParamField>

  See [Shell tool](#shell-tool) for full configuration details.
</Accordion>

<Accordion title="Full example">
  ```python  theme={null}
  from langchain_anthropic import ChatAnthropic
  from langchain_anthropic.middleware import ClaudeBashToolMiddleware
  from langchain.agents import create_agent
  from langchain.agents.middleware import DockerExecutionPolicy


  agent = create_agent(
      model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
      tools=[],
      middleware=[
          ClaudeBashToolMiddleware(
              workspace_root="/workspace",
              startup_commands=["pip install requests"],
              execution_policy=DockerExecutionPolicy(
                  image="python:3.11-slim",
              ),
          ),
      ],
  )

  # Claude can now use its native bash tool
  result = agent.invoke({
      "messages": [{"role": "user", "content": "List files in the workspace"}]
  })
  ```
</Accordion>

#### Text editor

Provide Claude's text editor tool (`text_editor_20250728`) for file creation and editing. The text editor middleware is useful for the following:

* File-based agent workflows
* Code editing and refactoring tasks
* Multi-file project work
* Agents that need persistent file storage

<Note>
  Available in two variants: **State-based** (files in LangGraph state) and **Filesystem-based** (files on disk).
</Note>

**API reference:** [`StateClaudeTextEditorMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.StateClaudeTextEditorMiddleware), [`FilesystemClaudeTextEditorMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.FilesystemClaudeTextEditorMiddleware)

```python  theme={null}
from langchain_anthropic import ChatAnthropic
from langchain_anthropic.middleware import StateClaudeTextEditorMiddleware
from langchain.agents import create_agent

# State-based (files in LangGraph state)
agent = create_agent(
    model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
    tools=[],
    middleware=[
        StateClaudeTextEditorMiddleware(),
    ],
)
```

<Accordion title="Configuration options">
  **[`StateClaudeTextEditorMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.StateClaudeTextEditorMiddleware) (state-based)**

  <ParamField body="allowed_path_prefixes" type="Sequence[str] | None">
    Optional list of allowed path prefixes. If specified, only paths starting with these prefixes are allowed.
  </ParamField>

  **[`FilesystemClaudeTextEditorMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.FilesystemClaudeTextEditorMiddleware) (filesystem-based)**

  <ParamField body="root_path" type="str" required>
    Root directory for file operations
  </ParamField>

  <ParamField body="allowed_prefixes" type="list[str] | None">
    Optional list of allowed virtual path prefixes (default: `["/"]`)
  </ParamField>

  <ParamField body="max_file_size_mb" type="int" default="10">
    Maximum file size in MB
  </ParamField>
</Accordion>

<Accordion title="Full example">
  Claude's text editor tool supports the following commands:

  * `view` - View file contents or list directory
  * `create` - Create a new file
  * `str_replace` - Replace string in file
  * `insert` - Insert text at line number
  * `delete` - Delete a file
  * `rename` - Rename/move a file

  ```python  theme={null}
  from langchain_anthropic import ChatAnthropic
  from langchain_anthropic.middleware import (
      StateClaudeTextEditorMiddleware,
      FilesystemClaudeTextEditorMiddleware,
  )
  from langchain.agents import create_agent


  # State-based: Files persist in LangGraph state
  agent_state = create_agent(
      model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
      tools=[],
      middleware=[
          StateClaudeTextEditorMiddleware(
              allowed_path_prefixes=["/project"],
          ),
      ],
  )

  # Filesystem-based: Files persist on disk
  agent_fs = create_agent(
      model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
      tools=[],
      middleware=[
          FilesystemClaudeTextEditorMiddleware(
              root_path="/workspace",
              allowed_prefixes=["/src"],
              max_file_size_mb=10,
          ),
      ],
  )
  ```
</Accordion>

#### Memory

Provide Claude's memory tool (`memory_20250818`) for persistent agent memory across conversation turns. The memory middleware is useful for the following:

* Long-running agent conversations
* Maintaining context across interruptions
* Task progress tracking
* Persistent agent state management

<Info>
  Claude's memory tool uses a `/memories` directory and automatically injects a system prompt encouraging the agent to check and update memory.
</Info>

**API reference:** [`StateClaudeMemoryMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.StateClaudeMemoryMiddleware), [`FilesystemClaudeMemoryMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.FilesystemClaudeMemoryMiddleware)

```python  theme={null}
from langchain_anthropic import ChatAnthropic
from langchain_anthropic.middleware import StateClaudeMemoryMiddleware
from langchain.agents import create_agent

# State-based memory
agent = create_agent(
    model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
    tools=[],
    middleware=[
        StateClaudeMemoryMiddleware(),
    ],
)
```

<Accordion title="Configuration options">
  **[`StateClaudeMemoryMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.StateClaudeMemoryMiddleware) (state-based)**

  <ParamField body="allowed_path_prefixes" type="Sequence[str] | None">
    Optional list of allowed path prefixes. Defaults to `["/memories"]`.
  </ParamField>

  <ParamField body="system_prompt" type="str">
    System prompt to inject. Defaults to Anthropic's recommended memory prompt that encourages the agent to check and update memory.
  </ParamField>

  **[`FilesystemClaudeMemoryMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.FilesystemClaudeMemoryMiddleware) (filesystem-based)**

  <ParamField body="root_path" type="str" required>
    Root directory for file operations
  </ParamField>

  <ParamField body="allowed_prefixes" type="list[str] | None">
    Optional list of allowed virtual path prefixes. Defaults to `["/memories"]`.
  </ParamField>

  <ParamField body="max_file_size_mb" type="int" default="10">
    Maximum file size in MB
  </ParamField>

  <ParamField body="system_prompt" type="str">
    System prompt to inject
  </ParamField>
</Accordion>

<Accordion title="Full example">
  ```python  theme={null}
  from langchain_anthropic import ChatAnthropic
  from langchain_anthropic.middleware import (
      StateClaudeMemoryMiddleware,
      FilesystemClaudeMemoryMiddleware,
  )
  from langchain.agents import create_agent


  # State-based: Memory persists in LangGraph state
  agent_state = create_agent(
      model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
      tools=[],
      middleware=[
          StateClaudeMemoryMiddleware(),
      ],
  )

  # Filesystem-based: Memory persists on disk
  agent_fs = create_agent(
      model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
      tools=[],
      middleware=[
          FilesystemClaudeMemoryMiddleware(
              root_path="/workspace",
          ),
      ],
  )

  # The agent will automatically:
  # 1. Check /memories directory at start
  # 2. Record progress and thoughts during execution
  # 3. Update memory files as work progresses
  ```
</Accordion>

#### File search

Provide Glob and Grep search tools for files stored in LangGraph state. File search middleware is useful for the following:

* Searching through state-based virtual file systems
* Works with text editor and memory tools
* Finding files by patterns
* Content search with regex

**API reference:** [`StateFileSearchMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.StateFileSearchMiddleware)

```python  theme={null}
from langchain_anthropic import ChatAnthropic
from langchain_anthropic.middleware import (
    StateClaudeTextEditorMiddleware,
    StateFileSearchMiddleware,
)
from langchain.agents import create_agent

agent = create_agent(
    model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
    tools=[],
    middleware=[
        StateClaudeTextEditorMiddleware(),
        StateFileSearchMiddleware(),  # Search text editor files
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="state_key" type="str" default="text_editor_files">
    State key containing files to search. Use `"text_editor_files"` for text editor files or `"memory_files"` for memory files.
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The middleware adds Glob and Grep search tools that work with state-based files.

  ```python  theme={null}
  from langchain_anthropic import ChatAnthropic
  from langchain_anthropic.middleware import (
      StateClaudeTextEditorMiddleware,
      StateClaudeMemoryMiddleware,
      StateFileSearchMiddleware,
  )
  from langchain.agents import create_agent


  # Search text editor files
  agent = create_agent(
      model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
      tools=[],
      middleware=[
          StateClaudeTextEditorMiddleware(),
          StateFileSearchMiddleware(state_key="text_editor_files"),
      ],
  )

  # Search memory files
  agent_memory = create_agent(
      model=ChatAnthropic(model="claude-sonnet-4-5-20250929"),
      tools=[],
      middleware=[
          StateClaudeMemoryMiddleware(),
          StateFileSearchMiddleware(state_key="memory_files"),
      ],
  )
  ```
</Accordion>

### OpenAI

Middleware specifically designed for OpenAI models.

| Middleware                                | Description                                               |
| ----------------------------------------- | --------------------------------------------------------- |
| [Content moderation](#content-moderation) | Moderate agent traffic using OpenAI's moderation endpoint |

#### Content moderation

Moderate agent traffic (user input, model output, and tool results) using OpenAI's moderation endpoint to detect and handle unsafe content. Content moderation is useful for the following:

* Applications requiring content safety and compliance
* Filtering harmful, hateful, or inappropriate content
* Customer-facing agents that need safety guardrails
* Meeting platform moderation requirements

<Info>
  Learn more about [OpenAI's moderation models](https://platform.openai.com/docs/guides/moderation) and categories.
</Info>

**API reference:** [`OpenAIModerationMiddleware`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.OpenAIModerationMiddleware)

```python  theme={null}
from langchain_openai import ChatOpenAI
from langchain_openai.middleware import OpenAIModerationMiddleware
from langchain.agents import create_agent

agent = create_agent(
    model=ChatOpenAI(model="gpt-4o"),
    tools=[search_tool, database_tool],
    middleware=[
        OpenAIModerationMiddleware(
            model="omni-moderation-latest",
            check_input=True,
            check_output=True,
            exit_behavior="end",
        ),
    ],
)
```

<Accordion title="Configuration options">
  <ParamField body="model" type="ModerationModel" default="omni-moderation-latest">
    OpenAI moderation model to use. Options: `'omni-moderation-latest'`, `'omni-moderation-2024-09-26'`, `'text-moderation-latest'`, `'text-moderation-stable'`
  </ParamField>

  <ParamField body="check_input" type="bool" default="True">
    Whether to check user input messages before the model is called
  </ParamField>

  <ParamField body="check_output" type="bool" default="True">
    Whether to check model output messages after the model is called
  </ParamField>

  <ParamField body="check_tool_results" type="bool" default="False">
    Whether to check tool result messages before the model is called
  </ParamField>

  <ParamField body="exit_behavior" type="string" default="end">
    How to handle violations when content is flagged. Options:

    * `'end'` - End agent execution immediately with a violation message
    * `'error'` - Raise `OpenAIModerationError` exception
    * `'replace'` - Replace the flagged content with the violation message and continue
  </ParamField>

  <ParamField body="violation_message" type="str | None">
    Custom template for violation messages. Supports template variables:

    * `{categories}` - Comma-separated list of flagged categories
    * `{category_scores}` - JSON string of category scores
    * `{original_content}` - The original flagged content

    Default: `"I'm sorry, but I can't comply with that request. It was flagged for {categories}."`
  </ParamField>

  <ParamField body="client" type="OpenAI | None">
    Optional pre-configured OpenAI client to reuse. If not provided, a new client will be created.
  </ParamField>

  <ParamField body="async_client" type="AsyncOpenAI | None">
    Optional pre-configured AsyncOpenAI client to reuse. If not provided, a new async client will be created.
  </ParamField>
</Accordion>

<Accordion title="Full example">
  The middleware integrates OpenAI's moderation endpoint to check content at different stages:

  **Moderation stages:**

  * `check_input` - User messages before model call
  * `check_output` - AI messages after model call
  * `check_tool_results` - Tool outputs before model call

  **Exit behaviors:**

  * `'end'` (default) - Stop execution with violation message
  * `'error'` - Raise exception for application handling
  * `'replace'` - Replace flagged content and continue

  ```python  theme={null}
  from langchain_openai import ChatOpenAI
  from langchain_openai.middleware import OpenAIModerationMiddleware
  from langchain.agents import create_agent


  # Basic moderation
  agent = create_agent(
      model=ChatOpenAI(model="gpt-4o"),
      tools=[search_tool, customer_data_tool],
      middleware=[
          OpenAIModerationMiddleware(
              model="omni-moderation-latest",
              check_input=True,
              check_output=True,
          ),
      ],
  )

  # Strict moderation with custom message
  agent_strict = create_agent(
      model=ChatOpenAI(model="gpt-4o"),
      tools=[search_tool, customer_data_tool],
      middleware=[
          OpenAIModerationMiddleware(
              model="omni-moderation-latest",
              check_input=True,
              check_output=True,
              check_tool_results=True,
              exit_behavior="error",
              violation_message=(
                  "Content policy violation detected: {categories}. "
                  "Please rephrase your request."
              ),
          ),
      ],
  )

  # Moderation with replacement behavior
  agent_replace = create_agent(
      model=ChatOpenAI(model="gpt-4o"),
      tools=[search_tool],
      middleware=[
          OpenAIModerationMiddleware(
              check_input=True,
              exit_behavior="replace",
              violation_message="[Content removed due to safety policies]",
          ),
      ],
  )
  ```
</Accordion>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/middleware/built-in.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt



-------------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/custom-------------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/custom-------------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/custom-------------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/custom-------------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/custom-------------------------------------------https://docs.langchain.com/oss/python/langchain/middleware/custom


# Custom middleware

Build custom middleware by implementing hooks that run at specific points in the agent execution flow.

## Hooks

Middleware provides two styles of hooks to intercept agent execution:

<CardGroup cols={2}>
  <Card title="Node-style hooks" icon="share-nodes" href="#node-style-hooks">
    Run sequentially at specific execution points.
  </Card>

  <Card title="Wrap-style hooks" icon="container-storage" href="#wrap-style-hooks">
    Run around each model or tool call.
  </Card>
</CardGroup>

### Node-style hooks

Run sequentially at specific execution points. Use for logging, validation, and state updates.

**Available hooks:**

* `before_agent` - Before agent starts (once per invocation)
* `before_model` - Before each model call
* `after_model` - After each model response
* `after_agent` - After agent completes (once per invocation)

**Example:**

<Tabs>
  <Tab title="Decorator">
    ```python  theme={null}
    from langchain.agents.middleware import before_model, after_model, AgentState
    from langchain.messages import AIMessage
    from langgraph.runtime import Runtime
    from typing import Any


    @before_model(can_jump_to=["end"])
    def check_message_limit(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
        if len(state["messages"]) >= 50:
            return {
                "messages": [AIMessage("Conversation limit reached.")],
                "jump_to": "end"
            }
        return None

    @after_model
    def log_response(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
        print(f"Model returned: {state['messages'][-1].content}")
        return None
    ```
  </Tab>

  <Tab title="Class">
    ```python  theme={null}
    from langchain.agents.middleware import AgentMiddleware, AgentState, hook_config
    from langchain.messages import AIMessage
    from langgraph.runtime import Runtime
    from typing import Any

    class MessageLimitMiddleware(AgentMiddleware):
        def __init__(self, max_messages: int = 50):
            super().__init__()
            self.max_messages = max_messages

        @hook_config(can_jump_to=["end"])
        def before_model(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
            if len(state["messages"]) == self.max_messages:
                return {
                    "messages": [AIMessage("Conversation limit reached.")],
                    "jump_to": "end"
                }
            return None

        def after_model(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
            print(f"Model returned: {state['messages'][-1].content}")
            return None
    ```
  </Tab>
</Tabs>

### Wrap-style hooks

Intercept execution and control when the handler is called. Use for retries, caching, and transformation.

You decide if the handler is called zero times (short-circuit), once (normal flow), or multiple times (retry logic).

**Available hooks:**

* `wrap_model_call` - Around each model call
* `wrap_tool_call` - Around each tool call

**Example:**

<Tabs>
  <Tab title="Decorator">
    ```python  theme={null}
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from typing import Callable


    @wrap_model_call
    def retry_model(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse],
    ) -> ModelResponse:
        for attempt in range(3):
            try:
                return handler(request)
            except Exception as e:
                if attempt == 2:
                    raise
                print(f"Retry {attempt + 1}/3 after error: {e}")
    ```
  </Tab>

  <Tab title="Class">
    ```python  theme={null}
    from langchain.agents.middleware import AgentMiddleware, ModelRequest, ModelResponse
    from typing import Callable

    class RetryMiddleware(AgentMiddleware):
        def __init__(self, max_retries: int = 3):
            super().__init__()
            self.max_retries = max_retries

        def wrap_model_call(
            self,
            request: ModelRequest,
            handler: Callable[[ModelRequest], ModelResponse],
        ) -> ModelResponse:
            for attempt in range(self.max_retries):
                try:
                    return handler(request)
                except Exception as e:
                    if attempt == self.max_retries - 1:
                        raise
                    print(f"Retry {attempt + 1}/{self.max_retries} after error: {e}")
    ```
  </Tab>
</Tabs>

## Create middleware

You can create middleware in two ways:

<CardGroup cols={2}>
  <Card title="Decorator-based middleware" icon="at" href="#decorator-based-middleware">
    Quick and simple for single-hook middleware. Use decorators to wrap individual functions.
  </Card>

  <Card title="Class-based middleware" icon="brackets-curly" href="#class-based-middleware">
    More powerful for complex middleware with multiple hooks or configuration.
  </Card>
</CardGroup>

### Decorator-based middleware

Quick and simple for single-hook middleware. Use decorators to wrap individual functions.

**Available decorators:**

**Node-style:**

* [`@before_agent`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.before_agent) - Runs before agent starts (once per invocation)
* [`@before_model`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.before_model) - Runs before each model call
* [`@after_model`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.after_model) - Runs after each model response
* [`@after_agent`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.after_agent) - Runs after agent completes (once per invocation)

**Wrap-style:**

* [`@wrap_model_call`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.wrap_model_call) - Wraps each model call with custom logic
* [`@wrap_tool_call`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.wrap_tool_call) - Wraps each tool call with custom logic

**Convenience:**

* [`@dynamic_prompt`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.dynamic_prompt) - Generates dynamic system prompts

**Example:**

```python  theme={null}
from langchain.agents.middleware import before_model, wrap_model_call
from langchain.agents.middleware import AgentState, ModelRequest, ModelResponse
from langchain.agents import create_agent
from langgraph.runtime import Runtime
from typing import Any, Callable


@before_model
def log_before_model(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    print(f"About to call model with {len(state['messages'])} messages")
    return None

@wrap_model_call
def retry_model(
    request: ModelRequest,
    handler: Callable[[ModelRequest], ModelResponse],
) -> ModelResponse:
    for attempt in range(3):
        try:
            return handler(request)
        except Exception as e:
            if attempt == 2:
                raise
            print(f"Retry {attempt + 1}/3 after error: {e}")

agent = create_agent(
    model="gpt-4o",
    middleware=[log_before_model, retry_model],
    tools=[...],
)
```

**When to use decorators:**

* Single hook needed
* No complex configuration
* Quick prototyping

### Class-based middleware

More powerful for complex middleware with multiple hooks or configuration. Use classes when you need to define both sync and async implementations for the same hook, or when you want to combine multiple hooks in a single middleware.

**Example:**

```python  theme={null}
from langchain.agents.middleware import AgentMiddleware, AgentState, ModelRequest, ModelResponse
from langgraph.runtime import Runtime
from typing import Any, Callable

class LoggingMiddleware(AgentMiddleware):
    def before_model(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
        print(f"About to call model with {len(state['messages'])} messages")
        return None

    def after_model(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
        print(f"Model returned: {state['messages'][-1].content}")
        return None

agent = create_agent(
    model="gpt-4o",
    middleware=[LoggingMiddleware()],
    tools=[...],
)
```

**When to use classes:**

* Defining both sync and async implementations for the same hook
* Multiple hooks needed in a single middleware
* Complex configuration required (e.g., configurable thresholds, custom models)
* Reuse across projects with init-time configuration

## Custom state schema

Middleware can extend the agent's state with custom properties.

<Tabs>
  <Tab title="Decorator">
    ```python  theme={null}
    from langchain.agents import create_agent
    from langchain.messages import HumanMessage
    from langchain.agents.middleware import AgentState, before_model, after_model
    from typing_extensions import NotRequired
    from typing import Any
    from langgraph.runtime import Runtime


    class CustomState(AgentState):
        model_call_count: NotRequired[int]
        user_id: NotRequired[str]


    @before_model(state_schema=CustomState, can_jump_to=["end"])
    def check_call_limit(state: CustomState, runtime: Runtime) -> dict[str, Any] | None:
        count = state.get("model_call_count", 0)
        if count > 10:
            return {"jump_to": "end"}
        return None


    @after_model(state_schema=CustomState)
    def increment_counter(state: CustomState, runtime: Runtime) -> dict[str, Any] | None:
        return {"model_call_count": state.get("model_call_count", 0) + 1}


    agent = create_agent(
        model="gpt-4o",
        middleware=[check_call_limit, increment_counter],
        tools=[],
    )

    # Invoke with custom state
    result = agent.invoke({
        "messages": [HumanMessage("Hello")],
        "model_call_count": 0,
        "user_id": "user-123",
    })
    ```
  </Tab>

  <Tab title="Class">
    ```python  theme={null}
    from langchain.agents import create_agent
    from langchain.messages import HumanMessage
    from langchain.agents.middleware import AgentState, AgentMiddleware
    from typing_extensions import NotRequired
    from typing import Any


    class CustomState(AgentState):
        model_call_count: NotRequired[int]
        user_id: NotRequired[str]


    class CallCounterMiddleware(AgentMiddleware[CustomState]):
        state_schema = CustomState

        def before_model(self, state: CustomState, runtime) -> dict[str, Any] | None:
            count = state.get("model_call_count", 0)
            if count > 10:
                return {"jump_to": "end"}
            return None

        def after_model(self, state: CustomState, runtime) -> dict[str, Any] | None:
            return {"model_call_count": state.get("model_call_count", 0) + 1}


    agent = create_agent(
        model="gpt-4o",
        middleware=[CallCounterMiddleware()],
        tools=[],
    )

    # Invoke with custom state
    result = agent.invoke({
        "messages": [HumanMessage("Hello")],
        "model_call_count": 0,
        "user_id": "user-123",
    })
    ```
  </Tab>
</Tabs>

## Execution order

When using multiple middleware, understand how they execute:

```python  theme={null}
agent = create_agent(
    model="gpt-4o",
    middleware=[middleware1, middleware2, middleware3],
    tools=[...],
)
```

<Accordion title="Execution flow">
  **Before hooks run in order:**

  1. `middleware1.before_agent()`
  2. `middleware2.before_agent()`
  3. `middleware3.before_agent()`

  **Agent loop starts**

  4. `middleware1.before_model()`
  5. `middleware2.before_model()`
  6. `middleware3.before_model()`

  **Wrap hooks nest like function calls:**

  7. `middleware1.wrap_model_call()` → `middleware2.wrap_model_call()` → `middleware3.wrap_model_call()` → model

  **After hooks run in reverse order:**

  8. `middleware3.after_model()`
  9. `middleware2.after_model()`
  10. `middleware1.after_model()`

  **Agent loop ends**

  11. `middleware3.after_agent()`
  12. `middleware2.after_agent()`
  13. `middleware1.after_agent()`
</Accordion>

**Key rules:**

* `before_*` hooks: First to last
* `after_*` hooks: Last to first (reverse)
* `wrap_*` hooks: Nested (first middleware wraps all others)

## Agent jumps

To exit early from middleware, return a dictionary with `jump_to`:

**Available jump targets:**

* `'end'`: Jump to the end of the agent execution (or the first `after_agent` hook)
* `'tools'`: Jump to the tools node
* `'model'`: Jump to the model node (or the first `before_model` hook)

<Tabs>
  <Tab title="Decorator">
    ```python  theme={null}
    from langchain.agents.middleware import after_model, hook_config, AgentState
    from langchain.messages import AIMessage
    from langgraph.runtime import Runtime
    from typing import Any


    @after_model
    @hook_config(can_jump_to=["end"])
    def check_for_blocked(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
        last_message = state["messages"][-1]
        if "BLOCKED" in last_message.content:
            return {
                "messages": [AIMessage("I cannot respond to that request.")],
                "jump_to": "end"
            }
        return None
    ```
  </Tab>

  <Tab title="Class">
    ```python  theme={null}
    from langchain.agents.middleware import AgentMiddleware, hook_config, AgentState
    from langchain.messages import AIMessage
    from langgraph.runtime import Runtime
    from typing import Any

    class BlockedContentMiddleware(AgentMiddleware):
        @hook_config(can_jump_to=["end"])
        def after_model(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
            last_message = state["messages"][-1]
            if "BLOCKED" in last_message.content:
                return {
                    "messages": [AIMessage("I cannot respond to that request.")],
                    "jump_to": "end"
                }
            return None
    ```
  </Tab>
</Tabs>

## Best practices

1. Keep middleware focused - each should do one thing well
2. Handle errors gracefully - don't let middleware errors crash the agent
3. **Use appropriate hook types**:
   * Node-style for sequential logic (logging, validation)
   * Wrap-style for control flow (retry, fallback, caching)
4. Clearly document any custom state properties
5. Unit test middleware independently before integrating
6. Consider execution order - place critical middleware first in the list
7. Use built-in middleware when possible

## Examples

### Dynamic model selection

<Tabs>
  <Tab title="Decorator">
    ```python  theme={null}
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from langchain.chat_models import init_chat_model
    from typing import Callable


    complex_model = init_chat_model("gpt-4o")
    simple_model = init_chat_model("gpt-4o-mini")

    @wrap_model_call
    def dynamic_model(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse],
    ) -> ModelResponse:
        # Use different model based on conversation length
       if len(request.messages) > 10:
           model = complex_model
        else:
           model = simple_model
        return handler(request.override(model=model))
    ```
  </Tab>

  <Tab title="Class">
    ```python  theme={null}
    from langchain.agents.middleware import AgentMiddleware, ModelRequest, ModelResponse
    from langchain.chat_models import init_chat_model
    from typing import Callable

    complex_model = init_chat_model("gpt-4o")
    simple_model = init_chat_model("gpt-4o-mini")

    class DynamicModelMiddleware(AgentMiddleware):
        def wrap_model_call(
            self,
            request: ModelRequest,
            handler: Callable[[ModelRequest], ModelResponse],
        ) -> ModelResponse:
            # Use different model based on conversation length
            if len(request.messages) > 10:
               model = complex_model
            else:
               model = simple_model
            return handler(request.override(model=model))
    ```
  </Tab>
</Tabs>

### Tool call monitoring

<Tabs>
  <Tab title="Decorator">
    ```python  theme={null}
    from langchain.agents.middleware import wrap_tool_call
    from langchain.tools.tool_node import ToolCallRequest
    from langchain.messages import ToolMessage
    from langgraph.types import Command
    from typing import Callable


    @wrap_tool_call
    def monitor_tool(
        request: ToolCallRequest,
        handler: Callable[[ToolCallRequest], ToolMessage | Command],
    ) -> ToolMessage | Command:
        print(f"Executing tool: {request.tool_call['name']}")
        print(f"Arguments: {request.tool_call['args']}")
        try:
            result = handler(request)
            print(f"Tool completed successfully")
            return result
        except Exception as e:
            print(f"Tool failed: {e}")
            raise
    ```
  </Tab>

  <Tab title="Class">
    ```python  theme={null}
    from langchain.tools.tool_node import ToolCallRequest
    from langchain.agents.middleware import AgentMiddleware
    from langchain.messages import ToolMessage
    from langgraph.types import Command
    from typing import Callable

    class ToolMonitoringMiddleware(AgentMiddleware):
        def wrap_tool_call(
            self,
            request: ToolCallRequest,
            handler: Callable[[ToolCallRequest], ToolMessage | Command],
        ) -> ToolMessage | Command:
            print(f"Executing tool: {request.tool_call['name']}")
            print(f"Arguments: {request.tool_call['args']}")
            try:
                result = handler(request)
                print(f"Tool completed successfully")
                return result
            except Exception as e:
                print(f"Tool failed: {e}")
                raise
    ```
  </Tab>
</Tabs>

### Dynamically selecting tools

Select relevant tools at runtime to improve performance and accuracy.

**Benefits:**

* **Shorter prompts** - Reduce complexity by exposing only relevant tools
* **Better accuracy** - Models choose correctly from fewer options
* **Permission control** - Dynamically filter tools based on user access

<Tabs>
  <Tab title="Decorator">
    ```python  theme={null}
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from typing import Callable


    @wrap_model_call
    def select_tools(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse],
    ) -> ModelResponse:
        """Middleware to select relevant tools based on state/context."""
        # Select a small, relevant subset of tools based on state/context
        relevant_tools = select_relevant_tools(request.state, request.runtime)
        return handler(request.override(tools=relevant_tools))

    agent = create_agent(
        model="gpt-4o",
        tools=all_tools,  # All available tools need to be registered upfront
        middleware=[select_tools],
    )
    ```
  </Tab>

  <Tab title="Class">
    ```python  theme={null}
    from langchain.agents import create_agent
    from langchain.agents.middleware import AgentMiddleware, ModelRequest, ModelResponse
    from typing import Callable


    class ToolSelectorMiddleware(AgentMiddleware):
        def wrap_model_call(
            self,
            request: ModelRequest,
            handler: Callable[[ModelRequest], ModelResponse],
        ) -> ModelResponse:
            """Middleware to select relevant tools based on state/context."""
            # Select a small, relevant subset of tools based on state/context
            relevant_tools = select_relevant_tools(request.state, request.runtime)
            return handler(request.override(tools=relevant_tools))

    agent = create_agent(
        model="gpt-4o",
        tools=all_tools,  # All available tools need to be registered upfront
        middleware=[ToolSelectorMiddleware()],
    )
    ```
  </Tab>
</Tabs>

### Working with system messages

Modify system messages in middleware using the `system_message` field on `ModelRequest`. The `system_message` field contains a [`SystemMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.SystemMessage) object (even if the agent was created with a string `system_prompt`).

**Example: Adding context to system message**

<Tabs>
  <Tab title="Decorator">
    ```python  theme={null}
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from langchain.messages import SystemMessage
    from typing import Callable


    @wrap_model_call
    def add_context(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse],
    ) -> ModelResponse:
        # Always work with content blocks
        new_content = list(request.system_message.content_blocks) + [
            {"type": "text", "text": "Additional context."}
        ]
        new_system_message = SystemMessage(content=new_content)
        return handler(request.override(system_message=new_system_message))
    ```
  </Tab>

  <Tab title="Class">
    ```python  theme={null}
    from langchain.agents.middleware import AgentMiddleware, ModelRequest, ModelResponse
    from langchain.messages import SystemMessage
    from typing import Callable


    class ContextMiddleware(AgentMiddleware):
        def wrap_model_call(
            self,
            request: ModelRequest,
            handler: Callable[[ModelRequest], ModelResponse],
        ) -> ModelResponse:
            # Always work with content blocks
            new_content = list(request.system_message.content_blocks) + [
                {"type": "text", "text": "Additional context."}
            ]
            new_system_message = SystemMessage(content=new_content)
            return handler(request.override(system_message=new_system_message))
    ```
  </Tab>
</Tabs>

**Example: Working with cache control (Anthropic)**

When working with Anthropic models, you can use structured content blocks with cache control directives to cache large system prompts:

<Tabs>
  <Tab title="Decorator">
    ```python  theme={null}
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from langchain.messages import SystemMessage
    from typing import Callable


    @wrap_model_call
    def add_cached_context(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse],
    ) -> ModelResponse:
        # Always work with content blocks
        new_content = list(request.system_message.content_blocks) + [
            {
                "type": "text",
                "text": "Here is a large document to analyze:\n\n<document>...</document>",
                # content up until this point is cached
                "cache_control": {"type": "ephemeral"}
            }
        ]

        new_system_message = SystemMessage(content=new_content)
        return handler(request.override(system_message=new_system_message))
    ```
  </Tab>

  <Tab title="Class">
    ```python  theme={null}
    from langchain.agents.middleware import AgentMiddleware, ModelRequest, ModelResponse
    from langchain.messages import SystemMessage
    from typing import Callable


    class CachedContextMiddleware(AgentMiddleware):
        def wrap_model_call(
            self,
            request: ModelRequest,
            handler: Callable[[ModelRequest], ModelResponse],
        ) -> ModelResponse:
            # Always work with content blocks
            new_content = list(request.system_message.content_blocks) + [
                {
                    "type": "text",
                    "text": "Here is a large document to analyze:\n\n<document>...</document>",
                    "cache_control": {"type": "ephemeral"}  # This content will be cached
                }
            ]

            new_system_message = SystemMessage(content=new_content)
            return handler(request.override(system_message=new_system_message))
    ```
  </Tab>
</Tabs>

**Notes:**

* `ModelRequest.system_message` is always a [`SystemMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.SystemMessage) object, even if the agent was created with `system_prompt="string"`
* Use `SystemMessage.content_blocks` to access content as a list of blocks, regardless of whether the original content was a string or list
* When modifying system messages, use `content_blocks` and append new blocks to preserve existing structure
* You can pass [`SystemMessage`](https://reference.langchain.com/python/langchain/messages/#langchain.messages.SystemMessage) objects directly to `create_agent`'s `system_prompt` parameter for advanced use cases like cache control

## Additional resources

* [Middleware API reference](https://reference.langchain.com/python/langchain/middleware/)
* [Built-in middleware](/oss/python/langchain/middleware/built-in)
* [Testing agents](/oss/python/langchain/test)

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/middleware/custom.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


-----------------------------------------------https://docs.langchain.com/oss/python/langchain/guardrails-----------------------------------------------https://docs.langchain.com/oss/python/langchain/guardrails-----------------------------------------------https://docs.langchain.com/oss/python/langchain/guardrails-----------------------------------------------https://docs.langchain.com/oss/python/langchain/guardrails-----------------------------------------------https://docs.langchain.com/oss/python/langchain/guardrails-----------------------------------------------https://docs.langchain.com/oss/python/langchain/guardrails


# Guardrails

> Implement safety checks and content filtering for your agents

Guardrails help you build safe, compliant AI applications by validating and filtering content at key points in your agent's execution. They can detect sensitive information, enforce content policies, validate outputs, and prevent unsafe behaviors before they cause problems.

Common use cases include:

* Preventing PII leakage
* Detecting and blocking prompt injection attacks
* Blocking inappropriate or harmful content
* Enforcing business rules and compliance requirements
* Validating output quality and accuracy

You can implement guardrails using [middleware](/oss/python/langchain/middleware) to intercept execution at strategic points - before the agent starts, after it completes, or around model and tool calls.

<div style={{ display: "flex", justifyContent: "center" }}>
  <img src="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=eb4404b137edec6f6f0c8ccb8323eaf1" alt="Middleware flow diagram" className="rounded-lg" data-og-width="500" width="500" data-og-height="560" height="560" data-path="oss/images/middleware_final.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=280&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=483413aa87cf93323b0f47c0dd5528e8 280w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=560&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=41b7dd647447978ff776edafe5f42499 560w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=840&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=e9b14e264f68345de08ae76f032c52d4 840w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1100&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=ec45e1932d1279b1beee4a4b016b473f 1100w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1650&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=3bca5ebf8aa56632b8a9826f7f112e57 1650w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=2500&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=437f141d1266f08a95f030c2804691d9 2500w" />
</div>

Guardrails can be implemented using two complementary approaches:

<CardGroup cols={2}>
  <Card title="Deterministic guardrails" icon="list-check">
    Use rule-based logic like regex patterns, keyword matching, or explicit checks. Fast, predictable, and cost-effective, but may miss nuanced violations.
  </Card>

  <Card title="Model-based guardrails" icon="brain">
    Use LLMs or classifiers to evaluate content with semantic understanding. Catch subtle issues that rules miss, but are slower and more expensive.
  </Card>
</CardGroup>

LangChain provides both built-in guardrails (e.g., [PII detection](#pii-detection), [human-in-the-loop](#human-in-the-loop)) and a flexible middleware system for building custom guardrails using either approach.

## Built-in guardrails

### PII detection

LangChain provides built-in middleware for detecting and handling Personally Identifiable Information (PII) in conversations. This middleware can detect common PII types like emails, credit cards, IP addresses, and more.

PII detection middleware is helpful for cases such as health care and financial applications with compliance requirements, customer service agents that need to sanitize logs, and generally any application handling sensitive user data.

The PII middleware supports multiple strategies for handling detected PII:

| Strategy | Description                             | Example               |
| -------- | --------------------------------------- | --------------------- |
| `redact` | Replace with `[REDACTED_TYPE]`          | `[REDACTED_EMAIL]`    |
| `mask`   | Partially obscure (e.g., last 4 digits) | `****-****-****-1234` |
| `hash`   | Replace with deterministic hash         | `a8f5f167...`         |
| `block`  | Raise exception when detected           | Error thrown          |

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware


agent = create_agent(
    model="gpt-4o",
    tools=[customer_service_tool, email_tool],
    middleware=[
        # Redact emails in user input before sending to model
        PIIMiddleware(
            "email",
            strategy="redact",
            apply_to_input=True,
        ),
        # Mask credit cards in user input
        PIIMiddleware(
            "credit_card",
            strategy="mask",
            apply_to_input=True,
        ),
        # Block API keys - raise error if detected
        PIIMiddleware(
            "api_key",
            detector=r"sk-[a-zA-Z0-9]{32}",
            strategy="block",
            apply_to_input=True,
        ),
    ],
)

# When user provides PII, it will be handled according to the strategy
result = agent.invoke({
    "messages": [{"role": "user", "content": "My email is john.doe@example.com and card is 5105-1051-0510-5100"}]
})
```

<Accordion title="Built-in PII types and configuration">
  **Built-in PII types:**

  * `email` - Email addresses
  * `credit_card` - Credit card numbers (Luhn validated)
  * `ip` - IP addresses
  * `mac_address` - MAC addresses
  * `url` - URLs

  **Configuration options:**

  | Parameter               | Description                                                            | Default                |
  | ----------------------- | ---------------------------------------------------------------------- | ---------------------- |
  | `pii_type`              | Type of PII to detect (built-in or custom)                             | Required               |
  | `strategy`              | How to handle detected PII (`"block"`, `"redact"`, `"mask"`, `"hash"`) | `"redact"`             |
  | `detector`              | Custom detector function or regex pattern                              | `None` (uses built-in) |
  | `apply_to_input`        | Check user messages before model call                                  | `True`                 |
  | `apply_to_output`       | Check AI messages after model call                                     | `False`                |
  | `apply_to_tool_results` | Check tool result messages after execution                             | `False`                |
</Accordion>

See the [middleware documentation](/oss/python/langchain/middleware#pii-detection) for complete details on PII detection capabilities.

### Human-in-the-loop

LangChain provides built-in middleware for requiring human approval before executing sensitive operations. This is one of the most effective guardrails for high-stakes decisions.

Human-in-the-loop middleware is helpful for cases such as financial transactions and transfers, deleting or modifying production data, sending communications to external parties, and any operation with significant business impact.

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import Command


agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, send_email_tool, delete_database_tool],
    middleware=[
        HumanInTheLoopMiddleware(
            interrupt_on={
                # Require approval for sensitive operations
                "send_email": True,
                "delete_database": True,
                # Auto-approve safe operations
                "search": False,
            }
        ),
    ],
    # Persist the state across interrupts
    checkpointer=InMemorySaver(),
)

# Human-in-the-loop requires a thread ID for persistence
config = {"configurable": {"thread_id": "some_id"}}

# Agent will pause and wait for approval before executing sensitive tools
result = agent.invoke(
    {"messages": [{"role": "user", "content": "Send an email to the team"}]},
    config=config
)

result = agent.invoke(
    Command(resume={"decisions": [{"type": "approve"}]}),
    config=config  # Same thread ID to resume the paused conversation
)
```

<Tip>
  See the [human-in-the-loop documentation](/oss/python/langchain/human-in-the-loop) for complete details on implementing approval workflows.
</Tip>

## Custom guardrails

For more sophisticated guardrails, you can create custom middleware that runs before or after the agent executes. This gives you full control over validation logic, content filtering, and safety checks.

### Before agent guardrails

Use "before agent" hooks to validate requests once at the start of each invocation. This is useful for session-level checks like authentication, rate limiting, or blocking inappropriate requests before any processing begins.

<CodeGroup>
  ```python title="Class syntax" theme={null}
  from typing import Any

  from langchain.agents.middleware import AgentMiddleware, AgentState, hook_config
  from langgraph.runtime import Runtime

  class ContentFilterMiddleware(AgentMiddleware):
      """Deterministic guardrail: Block requests containing banned keywords."""

      def __init__(self, banned_keywords: list[str]):
          super().__init__()
          self.banned_keywords = [kw.lower() for kw in banned_keywords]

      @hook_config(can_jump_to=["end"])
      def before_agent(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
          # Get the first user message
          if not state["messages"]:
              return None

          first_message = state["messages"][0]
          if first_message.type != "human":
              return None

          content = first_message.content.lower()

          # Check for banned keywords
          for keyword in self.banned_keywords:
              if keyword in content:
                  # Block execution before any processing
                  return {
                      "messages": [{
                          "role": "assistant",
                          "content": "I cannot process requests containing inappropriate content. Please rephrase your request."
                      }],
                      "jump_to": "end"
                  }

          return None

  # Use the custom guardrail
  from langchain.agents import create_agent

  agent = create_agent(
      model="gpt-4o",
      tools=[search_tool, calculator_tool],
      middleware=[
          ContentFilterMiddleware(
              banned_keywords=["hack", "exploit", "malware"]
          ),
      ],
  )

  # This request will be blocked before any processing
  result = agent.invoke({
      "messages": [{"role": "user", "content": "How do I hack into a database?"}]
  })
  ```

  ```python title="Decorator syntax" theme={null}
  from typing import Any

  from langchain.agents.middleware import before_agent, AgentState, hook_config
  from langgraph.runtime import Runtime

  banned_keywords = ["hack", "exploit", "malware"]

  @before_agent(can_jump_to=["end"])
  def content_filter(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
      """Deterministic guardrail: Block requests containing banned keywords."""
      # Get the first user message
      if not state["messages"]:
          return None

      first_message = state["messages"][0]
      if first_message.type != "human":
          return None

      content = first_message.content.lower()

      # Check for banned keywords
      for keyword in banned_keywords:
          if keyword in content:
              # Block execution before any processing
              return {
                  "messages": [{
                      "role": "assistant",
                      "content": "I cannot process requests containing inappropriate content. Please rephrase your request."
                  }],
                  "jump_to": "end"
              }

      return None

  # Use the custom guardrail
  from langchain.agents import create_agent

  agent = create_agent(
      model="gpt-4o",
      tools=[search_tool, calculator_tool],
      middleware=[content_filter],
  )

  # This request will be blocked before any processing
  result = agent.invoke({
      "messages": [{"role": "user", "content": "How do I hack into a database?"}]
  })
  ```
</CodeGroup>

### After agent guardrails

Use "after agent" hooks to validate final outputs once before returning to the user. This is useful for model-based safety checks, quality validation, or final compliance scans on the complete agent response.

<CodeGroup>
  ```python title="Class syntax" theme={null}
  from langchain.agents.middleware import AgentMiddleware, AgentState, hook_config
  from langgraph.runtime import Runtime
  from langchain.messages import AIMessage
  from langchain.chat_models import init_chat_model
  from typing import Any

  class SafetyGuardrailMiddleware(AgentMiddleware):
      """Model-based guardrail: Use an LLM to evaluate response safety."""

      def __init__(self):
          super().__init__()
          self.safety_model = init_chat_model("gpt-4o-mini")

      @hook_config(can_jump_to=["end"])
      def after_agent(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
          # Get the final AI response
          if not state["messages"]:
              return None

          last_message = state["messages"][-1]
          if not isinstance(last_message, AIMessage):
              return None

          # Use a model to evaluate safety
          safety_prompt = f"""Evaluate if this response is safe and appropriate.
          Respond with only 'SAFE' or 'UNSAFE'.

          Response: {last_message.content}"""

          result = self.safety_model.invoke([{"role": "user", "content": safety_prompt}])

          if "UNSAFE" in result.content:
              last_message.content = "I cannot provide that response. Please rephrase your request."

          return None

  # Use the safety guardrail
  from langchain.agents import create_agent

  agent = create_agent(
      model="gpt-4o",
      tools=[search_tool, calculator_tool],
      middleware=[SafetyGuardrailMiddleware()],
  )

  result = agent.invoke({
      "messages": [{"role": "user", "content": "How do I make explosives?"}]
  })
  ```

  ```python title="Decorator syntax" theme={null}
  from langchain.agents.middleware import after_agent, AgentState, hook_config
  from langgraph.runtime import Runtime
  from langchain.messages import AIMessage
  from langchain.chat_models import init_chat_model
  from typing import Any

  safety_model = init_chat_model("gpt-4o-mini")

  @after_agent(can_jump_to=["end"])
  def safety_guardrail(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
      """Model-based guardrail: Use an LLM to evaluate response safety."""
      # Get the final AI response
      if not state["messages"]:
          return None

      last_message = state["messages"][-1]
      if not isinstance(last_message, AIMessage):
          return None

      # Use a model to evaluate safety
      safety_prompt = f"""Evaluate if this response is safe and appropriate.
      Respond with only 'SAFE' or 'UNSAFE'.

      Response: {last_message.content}"""

      result = safety_model.invoke([{"role": "user", "content": safety_prompt}])

      if "UNSAFE" in result.content:
          last_message.content = "I cannot provide that response. Please rephrase your request."

      return None

  # Use the safety guardrail
  from langchain.agents import create_agent

  agent = create_agent(
      model="gpt-4o",
      tools=[search_tool, calculator_tool],
      middleware=[safety_guardrail],
  )

  result = agent.invoke({
      "messages": [{"role": "user", "content": "How do I make explosives?"}]
  })
  ```
</CodeGroup>

### Combine multiple guardrails

You can stack multiple guardrails by adding them to the middleware array. They execute in order, allowing you to build layered protection:

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware, HumanInTheLoopMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, send_email_tool],
    middleware=[
        # Layer 1: Deterministic input filter (before agent)
        ContentFilterMiddleware(banned_keywords=["hack", "exploit"]),

        # Layer 2: PII protection (before and after model)
        PIIMiddleware("email", strategy="redact", apply_to_input=True),
        PIIMiddleware("email", strategy="redact", apply_to_output=True),

        # Layer 3: Human approval for sensitive tools
        HumanInTheLoopMiddleware(interrupt_on={"send_email": True}),

        # Layer 4: Model-based safety check (after agent)
        SafetyGuardrailMiddleware(),
    ],
)
```

## Additional resources

* [Middleware documentation](/oss/python/langchain/middleware) - Complete guide to custom middleware
* [Middleware API reference](https://reference.langchain.com/python/langchain/middleware/) - Complete guide to custom middleware
* [Human-in-the-loop](/oss/python/langchain/human-in-the-loop) - Add human review for sensitive operations
* [Testing agents](/oss/python/langchain/test) - Strategies for testing safety mechanisms

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/guardrails.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


-------------------------------------------------https://docs.langchain.com/oss/python/langchain/runtime-------------------------------------------------https://docs.langchain.com/oss/python/langchain/runtime-------------------------------------------------https://docs.langchain.com/oss/python/langchain/runtime-------------------------------------------------https://docs.langchain.com/oss/python/langchain/runtime-------------------------------------------------https://docs.langchain.com/oss/python/langchain/runtime


# Runtime

## Overview

LangChain's [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) runs on LangGraph's runtime under the hood.

LangGraph exposes a [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime) object with the following information:

1. **Context**: static information like user id, db connections, or other dependencies for an agent invocation
2. **Store**: a [BaseStore](https://reference.langchain.com/python/langgraph/store/#langgraph.store.base.BaseStore) instance used for [long-term memory](/oss/python/langchain/long-term-memory)
3. **Stream writer**: an object used for streaming information via the `"custom"` stream mode

<Tip>
  Runtime context provides **dependency injection** for your tools and middleware. Instead of hardcoding values or using global state, you can inject runtime dependencies (like database connections, user IDs, or configuration) when invoking your agent. This makes your tools more testable, reusable, and flexible.
</Tip>

You can access the runtime information within [tools](#inside-tools) and [middleware](#inside-middleware).

## Access

When creating an agent with [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent), you can specify a `context_schema` to define the structure of the `context` stored in the agent [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime).

When invoking the agent, pass the `context` argument with the relevant configuration for the run:

```python  theme={null}
from dataclasses import dataclass

from langchain.agents import create_agent


@dataclass
class Context:
    user_name: str

agent = create_agent(
    model="gpt-5-nano",
    tools=[...],
    context_schema=Context  # [!code highlight]
)

agent.invoke(
    {"messages": [{"role": "user", "content": "What's my name?"}]},
    context=Context(user_name="John Smith")  # [!code highlight]
)
```

### Inside tools

You can access the runtime information inside tools to:

* Access the context
* Read or write long-term memory
* Write to the [custom stream](/oss/python/langchain/streaming#custom-updates) (ex, tool progress / updates)

Use the `ToolRuntime` parameter to access the [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime) object inside a tool.

```python  theme={null}
from dataclasses import dataclass
from langchain.tools import tool, ToolRuntime  # [!code highlight]

@dataclass
class Context:
    user_id: str

@tool
def fetch_user_email_preferences(runtime: ToolRuntime[Context]) -> str:  # [!code highlight]
    """Fetch the user's email preferences from the store."""
    user_id = runtime.context.user_id  # [!code highlight]

    preferences: str = "The user prefers you to write a brief and polite email."
    if runtime.store:  # [!code highlight]
        if memory := runtime.store.get(("users",), user_id):  # [!code highlight]
            preferences = memory.value["preferences"]

    return preferences
```

### Inside middleware

You can access runtime information in middleware to create dynamic prompts, modify messages, or control agent behavior based on user context.

Use `request.runtime` to access the [`Runtime`](https://reference.langchain.com/python/langgraph/runtime/#langgraph.runtime.Runtime) object inside middleware decorators. The runtime object is available in the [`ModelRequest`](https://reference.langchain.com/python/langchain/middleware/#langchain.agents.middleware.ModelRequest) parameter passed to middleware functions.

```python  theme={null}
from dataclasses import dataclass

from langchain.messages import AnyMessage
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import dynamic_prompt, ModelRequest, before_model, after_model
from langgraph.runtime import Runtime


@dataclass
class Context:
    user_name: str

# Dynamic prompts
@dynamic_prompt
def dynamic_system_prompt(request: ModelRequest) -> str:
    user_name = request.runtime.context.user_name  # [!code highlight]
    system_prompt = f"You are a helpful assistant. Address the user as {user_name}."
    return system_prompt

# Before model hook
@before_model
def log_before_model(state: AgentState, runtime: Runtime[Context]) -> dict | None:  # [!code highlight]
    print(f"Processing request for user: {runtime.context.user_name}")  # [!code highlight]
    return None

# After model hook
@after_model
def log_after_model(state: AgentState, runtime: Runtime[Context]) -> dict | None:  # [!code highlight]
    print(f"Completed request for user: {runtime.context.user_name}")  # [!code highlight]
    return None

agent = create_agent(
    model="gpt-5-nano",
    tools=[...],
    middleware=[dynamic_system_prompt, log_before_model, log_after_model],  # [!code highlight]
    context_schema=Context
)

agent.invoke(
    {"messages": [{"role": "user", "content": "What's my name?"}]},
    context=Context(user_name="John Smith")
)
```

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/runtime.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


----------------------------------------------------------------https://docs.langchain.com/oss/python/langchain/context-engineering----------------------------------------------------------------https://docs.langchain.com/oss/python/langchain/context-engineering----------------------------------------------------------------https://docs.langchain.com/oss/python/langchain/context-engineering----------------------------------------------------------------https://docs.langchain.com/oss/python/langchain/context-engineering


# Context engineering in agents

## Overview

The hard part of building agents (or any LLM application) is making them reliable enough. While they may work for a prototype, they often fail in real-world use cases.

### Why do agents fail?

When agents fail, it's usually because the LLM call inside the agent took the wrong action / didn't do what we expected. LLMs fail for one of two reasons:

1. The underlying LLM is not capable enough
2. The "right" context was not passed to the LLM

More often than not - it's actually the second reason that causes agents to not be reliable.

**Context engineering** is providing the right information and tools in the right format so the LLM can accomplish a task. This is the number one job of AI Engineers. This lack of "right" context is the number one blocker for more reliable agents, and LangChain's agent abstractions are uniquely designed to facilitate context engineering.

<Tip>
  New to context engineering? Start with the [conceptual overview](/oss/python/concepts/context) to understand the different types of context and when to use them.
</Tip>

### The agent loop

A typical agent loop consists of two main steps:

1. **Model call** - calls the LLM with a prompt and available tools, returns either a response or a request to execute tools
2. **Tool execution** - executes the tools that the LLM requested, returns tool results

<div style={{ display: "flex", justifyContent: "center" }}>
  <img src="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=ac72e48317a9ced68fd1be64e89ec063" alt="Core agent loop diagram" className="rounded-lg" data-og-width="300" width="300" data-og-height="268" height="268" data-path="oss/images/core_agent_loop.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=280&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=a4c4b766b6678ef52a6ed556b1a0b032 280w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=560&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=111869e6e99a52c0eff60a1ef7ddc49c 560w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=840&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=6c1e21de7b53bd0a29683aca09c6f86e 840w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1100&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=88bef556edba9869b759551c610c60f4 1100w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=1650&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=9b0bdd138e9548eeb5056dc0ed2d4a4b 1650w, https://mintcdn.com/langchain-5e9cc07a/Tazq8zGc0yYUYrDl/oss/images/core_agent_loop.png?w=2500&fit=max&auto=format&n=Tazq8zGc0yYUYrDl&q=85&s=41eb4f053ed5e6b0ba5bad2badf6d755 2500w" />
</div>

This loop continues until the LLM decides to finish.

### What you can control

To build reliable agents, you need to control what happens at each step of the agent loop, as well as what happens between steps.

| Context Type                                  | What You Control                                                                     | Transient or Persistent |
| --------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------- |
| **[Model Context](#model-context)**           | What goes into model calls (instructions, message history, tools, response format)   | Transient               |
| **[Tool Context](#tool-context)**             | What tools can access and produce (reads/writes to state, store, runtime context)    | Persistent              |
| **[Life-cycle Context](#life-cycle-context)** | What happens between model and tool calls (summarization, guardrails, logging, etc.) | Persistent              |

<CardGroup>
  <Card title="Transient context" icon="bolt" iconType="duotone">
    What the LLM sees for a single call. You can modify messages, tools, or prompts without changing what's saved in state.
  </Card>

  <Card title="Persistent context" icon="database" iconType="duotone">
    What gets saved in state across turns. Life-cycle hooks and tool writes modify this permanently.
  </Card>
</CardGroup>

### Data sources

Throughout this process, your agent accesses (reads / writes) different sources of data:

| Data Source         | Also Known As        | Scope               | Examples                                                                   |
| ------------------- | -------------------- | ------------------- | -------------------------------------------------------------------------- |
| **Runtime Context** | Static configuration | Conversation-scoped | User ID, API keys, database connections, permissions, environment settings |
| **State**           | Short-term memory    | Conversation-scoped | Current messages, uploaded files, authentication status, tool results      |
| **Store**           | Long-term memory     | Cross-conversation  | User preferences, extracted insights, memories, historical data            |

### How it works

LangChain [middleware](/oss/python/langchain/middleware) is the mechanism under the hood that makes context engineering practical for developers using LangChain.

Middleware allows you to hook into any step in the agent lifecycle and:

* Update context
* Jump to a different step in the agent lifecycle

Throughout this guide, you'll see frequent use of the middleware API as a means to the context engineering end.

## Model Context

Control what goes into each model call - instructions, available tools, which model to use, and output format. These decisions directly impact reliability and cost.

<CardGroup cols={2}>
  <Card title="System Prompt" icon="message-lines" href="#system-prompt">
    Base instructions from the developer to the LLM.
  </Card>

  <Card title="Messages" icon="comments" href="#messages">
    The full list of messages (conversation history) sent to the LLM.
  </Card>

  <Card title="Tools" icon="wrench" href="#tools">
    Utilities the agent has access to to take actions.
  </Card>

  <Card title="Model" icon="brain-circuit" href="#model">
    The actual model (including configuration) to be called.
  </Card>

  <Card title="Response Format" icon="brackets-curly" href="#response-format">
    Schema specification for the model's final response.
  </Card>
</CardGroup>

All of these types of model context can draw from **state** (short-term memory), **store** (long-term memory), or **runtime context** (static configuration).

### System Prompt

The system prompt sets the LLM's behavior and capabilities. Different users, contexts, or conversation stages need different instructions. Successful agents draw on memories, preferences, and configuration to provide the right instructions for the current state of the conversation.

<Tabs>
  <Tab title="State">
    Access message count or conversation context from state:

    ```python  theme={null}
    from langchain.agents import create_agent
    from langchain.agents.middleware import dynamic_prompt, ModelRequest

    @dynamic_prompt
    def state_aware_prompt(request: ModelRequest) -> str:
        # request.messages is a shortcut for request.state["messages"]
        message_count = len(request.messages)

        base = "You are a helpful assistant."

        if message_count > 10:
            base += "\nThis is a long conversation - be extra concise."

        return base

    agent = create_agent(
        model="gpt-4o",
        tools=[...],
        middleware=[state_aware_prompt]
    )
    ```
  </Tab>

  <Tab title="Store">
    Access user preferences from long-term memory:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.agents import create_agent
    from langchain.agents.middleware import dynamic_prompt, ModelRequest
    from langgraph.store.memory import InMemoryStore

    @dataclass
    class Context:
        user_id: str

    @dynamic_prompt
    def store_aware_prompt(request: ModelRequest) -> str:
        user_id = request.runtime.context.user_id

        # Read from Store: get user preferences
        store = request.runtime.store
        user_prefs = store.get(("preferences",), user_id)

        base = "You are a helpful assistant."

        if user_prefs:
            style = user_prefs.value.get("communication_style", "balanced")
            base += f"\nUser prefers {style} responses."

        return base

    agent = create_agent(
        model="gpt-4o",
        tools=[...],
        middleware=[store_aware_prompt],
        context_schema=Context,
        store=InMemoryStore()
    )
    ```
  </Tab>

  <Tab title="Runtime Context">
    Access user ID or configuration from Runtime Context:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.agents import create_agent
    from langchain.agents.middleware import dynamic_prompt, ModelRequest

    @dataclass
    class Context:
        user_role: str
        deployment_env: str

    @dynamic_prompt
    def context_aware_prompt(request: ModelRequest) -> str:
        # Read from Runtime Context: user role and environment
        user_role = request.runtime.context.user_role
        env = request.runtime.context.deployment_env

        base = "You are a helpful assistant."

        if user_role == "admin":
            base += "\nYou have admin access. You can perform all operations."
        elif user_role == "viewer":
            base += "\nYou have read-only access. Guide users to read operations only."

        if env == "production":
            base += "\nBe extra careful with any data modifications."

        return base

    agent = create_agent(
        model="gpt-4o",
        tools=[...],
        middleware=[context_aware_prompt],
        context_schema=Context
    )
    ```
  </Tab>
</Tabs>

### Messages

Messages make up the prompt that is sent to the LLM.
It's critical to manage the content of messages to ensure that the LLM has the right information to respond well.

<Tabs>
  <Tab title="State">
    Inject uploaded file context from State when relevant to current query:

    ```python  theme={null}
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from typing import Callable

    @wrap_model_call
    def inject_file_context(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Inject context about files user has uploaded this session."""
        # Read from State: get uploaded files metadata
        uploaded_files = request.state.get("uploaded_files", [])  # [!code highlight]

        if uploaded_files:
            # Build context about available files
            file_descriptions = []
            for file in uploaded_files:
                file_descriptions.append(
                    f"- {file['name']} ({file['type']}): {file['summary']}"
                )

            file_context = f"""Files you have access to in this conversation:
    {chr(10).join(file_descriptions)}

    Reference these files when answering questions."""

            # Inject file context before recent messages
            messages = [  # [!code highlight]
                *request.messages,
                {"role": "user", "content": file_context},
            ]
            request = request.override(messages=messages)  # [!code highlight]

        return handler(request)

    agent = create_agent(
        model="gpt-4o",
        tools=[...],
        middleware=[inject_file_context]
    )
    ```
  </Tab>

  <Tab title="Store">
    Inject user's email writing style from Store to guide drafting:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from typing import Callable
    from langgraph.store.memory import InMemoryStore

    @dataclass
    class Context:
        user_id: str

    @wrap_model_call
    def inject_writing_style(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Inject user's email writing style from Store."""
        user_id = request.runtime.context.user_id  # [!code highlight]

        # Read from Store: get user's writing style examples
        store = request.runtime.store  # [!code highlight]
        writing_style = store.get(("writing_style",), user_id)  # [!code highlight]

        if writing_style:
            style = writing_style.value
            # Build style guide from stored examples
            style_context = f"""Your writing style:
    - Tone: {style.get('tone', 'professional')}
    - Typical greeting: "{style.get('greeting', 'Hi')}"
    - Typical sign-off: "{style.get('sign_off', 'Best')}"
    - Example email you've written:
    {style.get('example_email', '')}"""

            # Append at end - models pay more attention to final messages
            messages = [
                *request.messages,
                {"role": "user", "content": style_context}
            ]
            request = request.override(messages=messages)  # [!code highlight]

        return handler(request)

    agent = create_agent(
        model="gpt-4o",
        tools=[...],
        middleware=[inject_writing_style],
        context_schema=Context,
        store=InMemoryStore()
    )
    ```
  </Tab>

  <Tab title="Runtime Context">
    Inject compliance rules from Runtime Context based on user's jurisdiction:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from typing import Callable

    @dataclass
    class Context:
        user_jurisdiction: str
        industry: str
        compliance_frameworks: list[str]

    @wrap_model_call
    def inject_compliance_rules(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Inject compliance constraints from Runtime Context."""
        # Read from Runtime Context: get compliance requirements
        jurisdiction = request.runtime.context.user_jurisdiction  # [!code highlight]
        industry = request.runtime.context.industry  # [!code highlight]
        frameworks = request.runtime.context.compliance_frameworks  # [!code highlight]

        # Build compliance constraints
        rules = []
        if "GDPR" in frameworks:
            rules.append("- Must obtain explicit consent before processing personal data")
            rules.append("- Users have right to data deletion")
        if "HIPAA" in frameworks:
            rules.append("- Cannot share patient health information without authorization")
            rules.append("- Must use secure, encrypted communication")
        if industry == "finance":
            rules.append("- Cannot provide financial advice without proper disclaimers")

        if rules:
            compliance_context = f"""Compliance requirements for {jurisdiction}:
    {chr(10).join(rules)}"""

            # Append at end - models pay more attention to final messages
            messages = [
                *request.messages,
                {"role": "user", "content": compliance_context}
            ]
            request = request.override(messages=messages)  # [!code highlight]

        return handler(request)

    agent = create_agent(
        model="gpt-4o",
        tools=[...],
        middleware=[inject_compliance_rules],
        context_schema=Context
    )
    ```
  </Tab>
</Tabs>

<Note>
  **Transient vs Persistent Message Updates:**

  The examples above use `wrap_model_call` to make **transient** updates - modifying what messages are sent to the model for a single call without changing what's saved in state.

  For **persistent** updates that modify state (like the summarization example in [Life-cycle Context](#summarization)), use life-cycle hooks like `before_model` or `after_model` to permanently update the conversation history. See the [middleware documentation](/oss/python/langchain/middleware) for more details.
</Note>

### Tools

Tools let the model interact with databases, APIs, and external systems. How you define and select tools directly impacts whether the model can complete tasks effectively.

#### Defining tools

Each tool needs a clear name, description, argument names, and argument descriptions. These aren't just metadata—they guide the model's reasoning about when and how to use the tool.

```python  theme={null}
from langchain.tools import tool

@tool(parse_docstring=True)
def search_orders(
    user_id: str,
    status: str,
    limit: int = 10
) -> str:
    """Search for user orders by status.

    Use this when the user asks about order history or wants to check
    order status. Always filter by the provided status.

    Args:
        user_id: Unique identifier for the user
        status: Order status: 'pending', 'shipped', or 'delivered'
        limit: Maximum number of results to return
    """
    # Implementation here
    pass
```

#### Selecting tools

Not every tool is appropriate for every situation. Too many tools may overwhelm the model (overload context) and increase errors; too few limit capabilities. Dynamic tool selection adapts the available toolset based on authentication state, user permissions, feature flags, or conversation stage.

<Tabs>
  <Tab title="State">
    Enable advanced tools only after certain conversation milestones:

    ```python  theme={null}
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from typing import Callable

    @wrap_model_call
    def state_based_tools(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Filter tools based on conversation State."""
        # Read from State: check if user has authenticated
        state = request.state  # [!code highlight]
        is_authenticated = state.get("authenticated", False)  # [!code highlight]
        message_count = len(state["messages"])

        # Only enable sensitive tools after authentication
        if not is_authenticated:
            tools = [t for t in request.tools if t.name.startswith("public_")]
            request = request.override(tools=tools)  # [!code highlight]
        elif message_count < 5:
            # Limit tools early in conversation
            tools = [t for t in request.tools if t.name != "advanced_search"]
            request = request.override(tools=tools)  # [!code highlight]

        return handler(request)

    agent = create_agent(
        model="gpt-4o",
        tools=[public_search, private_search, advanced_search],
        middleware=[state_based_tools]
    )
    ```
  </Tab>

  <Tab title="Store">
    Filter tools based on user preferences or feature flags in Store:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from typing import Callable
    from langgraph.store.memory import InMemoryStore

    @dataclass
    class Context:
        user_id: str

    @wrap_model_call
    def store_based_tools(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Filter tools based on Store preferences."""
        user_id = request.runtime.context.user_id

        # Read from Store: get user's enabled features
        store = request.runtime.store
        feature_flags = store.get(("features",), user_id)

        if feature_flags:
            enabled_features = feature_flags.value.get("enabled_tools", [])
            # Only include tools that are enabled for this user
            tools = [t for t in request.tools if t.name in enabled_features]
            request = request.override(tools=tools)

        return handler(request)

    agent = create_agent(
        model="gpt-4o",
        tools=[search_tool, analysis_tool, export_tool],
        middleware=[store_based_tools],
        context_schema=Context,
        store=InMemoryStore()
    )
    ```
  </Tab>

  <Tab title="Runtime Context">
    Filter tools based on user permissions from Runtime Context:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from typing import Callable

    @dataclass
    class Context:
        user_role: str

    @wrap_model_call
    def context_based_tools(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Filter tools based on Runtime Context permissions."""
        # Read from Runtime Context: get user role
        user_role = request.runtime.context.user_role

        if user_role == "admin":
            # Admins get all tools
            pass
        elif user_role == "editor":
            # Editors can't delete
            tools = [t for t in request.tools if t.name != "delete_data"]
            request = request.override(tools=tools)
        else:
            # Viewers get read-only tools
            tools = [t for t in request.tools if t.name.startswith("read_")]
            request = request.override(tools=tools)

        return handler(request)

    agent = create_agent(
        model="gpt-4o",
        tools=[read_data, write_data, delete_data],
        middleware=[context_based_tools],
        context_schema=Context
    )
    ```
  </Tab>
</Tabs>

See [Dynamically selecting tools](/oss/python/langchain/middleware#dynamically-selecting-tools) for more examples.

### Model

Different models have different strengths, costs, and context windows. Select the right model for the task at hand, which
might change during an agent run.

<Tabs>
  <Tab title="State">
    Use different models based on conversation length from State:

    ```python  theme={null}
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from langchain.chat_models import init_chat_model
    from typing import Callable

    # Initialize models once outside the middleware
    large_model = init_chat_model("claude-sonnet-4-5-20250929")
    standard_model = init_chat_model("gpt-4o")
    efficient_model = init_chat_model("gpt-4o-mini")

    @wrap_model_call
    def state_based_model(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Select model based on State conversation length."""
        # request.messages is a shortcut for request.state["messages"]
        message_count = len(request.messages)  # [!code highlight]

        if message_count > 20:
            # Long conversation - use model with larger context window
            model = large_model
        elif message_count > 10:
            # Medium conversation
            model = standard_model
        else:
            # Short conversation - use efficient model
            model = efficient_model

        request = request.override(model=model)  # [!code highlight]

        return handler(request)

    agent = create_agent(
        model="gpt-4o-mini",
        tools=[...],
        middleware=[state_based_model]
    )
    ```
  </Tab>

  <Tab title="Store">
    Use user's preferred model from Store:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from langchain.chat_models import init_chat_model
    from typing import Callable
    from langgraph.store.memory import InMemoryStore

    @dataclass
    class Context:
        user_id: str

    # Initialize available models once
    MODEL_MAP = {
        "gpt-4o": init_chat_model("gpt-4o"),
        "gpt-4o-mini": init_chat_model("gpt-4o-mini"),
        "claude-sonnet": init_chat_model("claude-sonnet-4-5-20250929"),
    }

    @wrap_model_call
    def store_based_model(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Select model based on Store preferences."""
        user_id = request.runtime.context.user_id

        # Read from Store: get user's preferred model
        store = request.runtime.store
        user_prefs = store.get(("preferences",), user_id)

        if user_prefs:
            preferred_model = user_prefs.value.get("preferred_model")
            if preferred_model and preferred_model in MODEL_MAP:
                request = request.override(model=MODEL_MAP[preferred_model])

        return handler(request)

    agent = create_agent(
        model="gpt-4o",
        tools=[...],
        middleware=[store_based_model],
        context_schema=Context,
        store=InMemoryStore()
    )
    ```
  </Tab>

  <Tab title="Runtime Context">
    Select model based on cost limits or environment from Runtime Context:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from langchain.chat_models import init_chat_model
    from typing import Callable

    @dataclass
    class Context:
        cost_tier: str
        environment: str

    # Initialize models once outside the middleware
    premium_model = init_chat_model("claude-sonnet-4-5-20250929")
    standard_model = init_chat_model("gpt-4o")
    budget_model = init_chat_model("gpt-4o-mini")

    @wrap_model_call
    def context_based_model(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Select model based on Runtime Context."""
        # Read from Runtime Context: cost tier and environment
        cost_tier = request.runtime.context.cost_tier
        environment = request.runtime.context.environment

        if environment == "production" and cost_tier == "premium":
            # Production premium users get best model
            model = premium_model
        elif cost_tier == "budget":
            # Budget tier gets efficient model
            model = budget_model
        else:
            # Standard tier
            model = standard_model

        request = request.override(model=model)

        return handler(request)

    agent = create_agent(
        model="gpt-4o",
        tools=[...],
        middleware=[context_based_model],
        context_schema=Context
    )
    ```
  </Tab>
</Tabs>

See [Dynamic model](/oss/python/langchain/agents#dynamic-model) for more examples.

### Response Format

Structured output transforms unstructured text into validated, structured data. When extracting specific fields or returning data for downstream systems, free-form text isn't sufficient.

**How it works:** When you provide a schema as the response format, the model's final response is guaranteed to conform to that schema. The agent runs the model / tool calling loop until the model is done calling tools, then the final response is coerced into the provided format.

#### Defining formats

Schema definitions guide the model. Field names, types, and descriptions specify exactly what format the output should adhere to.

```python  theme={null}
from pydantic import BaseModel, Field

class CustomerSupportTicket(BaseModel):
    """Structured ticket information extracted from customer message."""

    category: str = Field(
        description="Issue category: 'billing', 'technical', 'account', or 'product'"
    )
    priority: str = Field(
        description="Urgency level: 'low', 'medium', 'high', or 'critical'"
    )
    summary: str = Field(
        description="One-sentence summary of the customer's issue"
    )
    customer_sentiment: str = Field(
        description="Customer's emotional tone: 'frustrated', 'neutral', or 'satisfied'"
    )
```

#### Selecting formats

Dynamic response format selection adapts schemas based on user preferences, conversation stage, or role—returning simple formats early and detailed formats as complexity increases.

<Tabs>
  <Tab title="State">
    Configure structured output based on conversation state:

    ```python  theme={null}
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from pydantic import BaseModel, Field
    from typing import Callable

    class SimpleResponse(BaseModel):
        """Simple response for early conversation."""
        answer: str = Field(description="A brief answer")

    class DetailedResponse(BaseModel):
        """Detailed response for established conversation."""
        answer: str = Field(description="A detailed answer")
        reasoning: str = Field(description="Explanation of reasoning")
        confidence: float = Field(description="Confidence score 0-1")

    @wrap_model_call
    def state_based_output(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Select output format based on State."""
        # request.messages is a shortcut for request.state["messages"]
        message_count = len(request.messages)  # [!code highlight]

        if message_count < 3:
            # Early conversation - use simple format
            request = request.override(response_format=SimpleResponse)  # [!code highlight]
        else:
            # Established conversation - use detailed format
            request = request.override(response_format=DetailedResponse)  # [!code highlight]

        return handler(request)

    agent = create_agent(
        model="gpt-4o",
        tools=[...],
        middleware=[state_based_output]
    )
    ```
  </Tab>

  <Tab title="Store">
    Configure output format based on user preferences in Store:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from pydantic import BaseModel, Field
    from typing import Callable
    from langgraph.store.memory import InMemoryStore

    @dataclass
    class Context:
        user_id: str

    class VerboseResponse(BaseModel):
        """Verbose response with details."""
        answer: str = Field(description="Detailed answer")
        sources: list[str] = Field(description="Sources used")

    class ConciseResponse(BaseModel):
        """Concise response."""
        answer: str = Field(description="Brief answer")

    @wrap_model_call
    def store_based_output(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Select output format based on Store preferences."""
        user_id = request.runtime.context.user_id

        # Read from Store: get user's preferred response style
        store = request.runtime.store
        user_prefs = store.get(("preferences",), user_id)

        if user_prefs:
            style = user_prefs.value.get("response_style", "concise")
            if style == "verbose":
                request = request.override(response_format=VerboseResponse)
            else:
                request = request.override(response_format=ConciseResponse)

        return handler(request)

    agent = create_agent(
        model="gpt-4o",
        tools=[...],
        middleware=[store_based_output],
        context_schema=Context,
        store=InMemoryStore()
    )
    ```
  </Tab>

  <Tab title="Runtime Context">
    Configure output format based on Runtime Context like user role or environment:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.agents import create_agent
    from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
    from pydantic import BaseModel, Field
    from typing import Callable

    @dataclass
    class Context:
        user_role: str
        environment: str

    class AdminResponse(BaseModel):
        """Response with technical details for admins."""
        answer: str = Field(description="Answer")
        debug_info: dict = Field(description="Debug information")
        system_status: str = Field(description="System status")

    class UserResponse(BaseModel):
        """Simple response for regular users."""
        answer: str = Field(description="Answer")

    @wrap_model_call
    def context_based_output(
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse]
    ) -> ModelResponse:
        """Select output format based on Runtime Context."""
        # Read from Runtime Context: user role and environment
        user_role = request.runtime.context.user_role
        environment = request.runtime.context.environment

        if user_role == "admin" and environment == "production":
            # Admins in production get detailed output
            request = request.override(response_format=AdminResponse)
        else:
            # Regular users get simple output
            request = request.override(response_format=UserResponse)

        return handler(request)

    agent = create_agent(
        model="gpt-4o",
        tools=[...],
        middleware=[context_based_output],
        context_schema=Context
    )
    ```
  </Tab>
</Tabs>

## Tool Context

Tools are special in that they both read and write context.

In the most basic case, when a tool executes, it receives the LLM's request parameters and returns a tool message back. The tool does its work and produces a result.

Tools can also fetch important information for the model that allows it to perform and complete tasks.

### Reads

Most real-world tools need more than just the LLM's parameters. They need user IDs for database queries, API keys for external services, or current session state to make decisions. Tools read from state, store, and runtime context to access this information.

<Tabs>
  <Tab title="State">
    Read from State to check current session information:

    ```python  theme={null}
    from langchain.tools import tool, ToolRuntime
    from langchain.agents import create_agent

    @tool
    def check_authentication(
        runtime: ToolRuntime
    ) -> str:
        """Check if user is authenticated."""
        # Read from State: check current auth status
        current_state = runtime.state
        is_authenticated = current_state.get("authenticated", False)

        if is_authenticated:
            return "User is authenticated"
        else:
            return "User is not authenticated"

    agent = create_agent(
        model="gpt-4o",
        tools=[check_authentication]
    )
    ```
  </Tab>

  <Tab title="Store">
    Read from Store to access persisted user preferences:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.tools import tool, ToolRuntime
    from langchain.agents import create_agent
    from langgraph.store.memory import InMemoryStore

    @dataclass
    class Context:
        user_id: str

    @tool
    def get_preference(
        preference_key: str,
        runtime: ToolRuntime[Context]
    ) -> str:
        """Get user preference from Store."""
        user_id = runtime.context.user_id

        # Read from Store: get existing preferences
        store = runtime.store
        existing_prefs = store.get(("preferences",), user_id)

        if existing_prefs:
            value = existing_prefs.value.get(preference_key)
            return f"{preference_key}: {value}" if value else f"No preference set for {preference_key}"
        else:
            return "No preferences found"

    agent = create_agent(
        model="gpt-4o",
        tools=[get_preference],
        context_schema=Context,
        store=InMemoryStore()
    )
    ```
  </Tab>

  <Tab title="Runtime Context">
    Read from Runtime Context for configuration like API keys and user IDs:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.tools import tool, ToolRuntime
    from langchain.agents import create_agent

    @dataclass
    class Context:
        user_id: str
        api_key: str
        db_connection: str

    @tool
    def fetch_user_data(
        query: str,
        runtime: ToolRuntime[Context]
    ) -> str:
        """Fetch data using Runtime Context configuration."""
        # Read from Runtime Context: get API key and DB connection
        user_id = runtime.context.user_id
        api_key = runtime.context.api_key
        db_connection = runtime.context.db_connection

        # Use configuration to fetch data
        results = perform_database_query(db_connection, query, api_key)

        return f"Found {len(results)} results for user {user_id}"

    agent = create_agent(
        model="gpt-4o",
        tools=[fetch_user_data],
        context_schema=Context
    )

    # Invoke with runtime context
    result = agent.invoke(
        {"messages": [{"role": "user", "content": "Get my data"}]},
        context=Context(
            user_id="user_123",
            api_key="sk-...",
            db_connection="postgresql://..."
        )
    )
    ```
  </Tab>
</Tabs>

### Writes

Tool results can be used to help an agent complete a given task. Tools can both return results directly to the model
and update the memory of the agent to make important context available to future steps.

<Tabs>
  <Tab title="State">
    Write to State to track session-specific information using Command:

    ```python  theme={null}
    from langchain.tools import tool, ToolRuntime
    from langchain.agents import create_agent
    from langgraph.types import Command

    @tool
    def authenticate_user(
        password: str,
        runtime: ToolRuntime
    ) -> Command:
        """Authenticate user and update State."""
        # Perform authentication (simplified)
        if password == "correct":
            # Write to State: mark as authenticated using Command
            return Command(
                update={"authenticated": True},
            )
        else:
            return Command(update={"authenticated": False})

    agent = create_agent(
        model="gpt-4o",
        tools=[authenticate_user]
    )
    ```
  </Tab>

  <Tab title="Store">
    Write to Store to persist data across sessions:

    ```python  theme={null}
    from dataclasses import dataclass
    from langchain.tools import tool, ToolRuntime
    from langchain.agents import create_agent
    from langgraph.store.memory import InMemoryStore

    @dataclass
    class Context:
        user_id: str

    @tool
    def save_preference(
        preference_key: str,
        preference_value: str,
        runtime: ToolRuntime[Context]
    ) -> str:
        """Save user preference to Store."""
        user_id = runtime.context.user_id

        # Read existing preferences
        store = runtime.store
        existing_prefs = store.get(("preferences",), user_id)

        # Merge with new preference
        prefs = existing_prefs.value if existing_prefs else {}
        prefs[preference_key] = preference_value

        # Write to Store: save updated preferences
        store.put(("preferences",), user_id, prefs)

        return f"Saved preference: {preference_key} = {preference_value}"

    agent = create_agent(
        model="gpt-4o",
        tools=[save_preference],
        context_schema=Context,
        store=InMemoryStore()
    )
    ```
  </Tab>
</Tabs>

See [Tools](/oss/python/langchain/tools) for comprehensive examples of accessing state, store, and runtime context in tools.

## Life-cycle Context

Control what happens **between** the core agent steps - intercepting data flow to implement cross-cutting concerns like summarization, guardrails, and logging.

As you've seen in [Model Context](#model-context) and [Tool Context](#tool-context), [middleware](/oss/python/langchain/middleware) is the mechanism that makes context engineering practical. Middleware allows you to hook into any step in the agent lifecycle and either:

1. **Update context** - Modify state and store to persist changes, update conversation history, or save insights
2. **Jump in the lifecycle** - Move to different steps in the agent cycle based on context (e.g., skip tool execution if a condition is met, repeat model call with modified context)

<div style={{ display: "flex", justifyContent: "center" }}>
  <img src="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=eb4404b137edec6f6f0c8ccb8323eaf1" alt="Middleware hooks in the agent loop" className="rounded-lg" data-og-width="500" width="500" data-og-height="560" height="560" data-path="oss/images/middleware_final.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=280&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=483413aa87cf93323b0f47c0dd5528e8 280w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=560&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=41b7dd647447978ff776edafe5f42499 560w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=840&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=e9b14e264f68345de08ae76f032c52d4 840w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1100&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=ec45e1932d1279b1beee4a4b016b473f 1100w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=1650&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=3bca5ebf8aa56632b8a9826f7f112e57 1650w, https://mintcdn.com/langchain-5e9cc07a/RAP6mjwE5G00xYsA/oss/images/middleware_final.png?w=2500&fit=max&auto=format&n=RAP6mjwE5G00xYsA&q=85&s=437f141d1266f08a95f030c2804691d9 2500w" />
</div>

### Example: Summarization

One of the most common life-cycle patterns is automatically condensing conversation history when it gets too long. Unlike the transient message trimming shown in [Model Context](#messages), summarization **persistently updates state** - permanently replacing old messages with a summary that's saved for all future turns.

LangChain offers built-in middleware for this:

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware

agent = create_agent(
    model="gpt-4o",
    tools=[...],
    middleware=[
        SummarizationMiddleware(
            model="gpt-4o-mini",
            trigger={"tokens": 4000},
            keep={"messages": 20},
        ),
    ],
)
```

When the conversation exceeds the token limit, `SummarizationMiddleware` automatically:

1. Summarizes older messages using a separate LLM call
2. Replaces them with a summary message in State (permanently)
3. Keeps recent messages intact for context

The summarized conversation history is permanently updated - future turns will see the summary instead of the original messages.

<Note>
  For a complete list of built-in middleware, available hooks, and how to create custom middleware, see the [Middleware documentation](/oss/python/langchain/middleware).
</Note>

## Best practices

1. **Start simple** - Begin with static prompts and tools, add dynamics only when needed
2. **Test incrementally** - Add one context engineering feature at a time
3. **Monitor performance** - Track model calls, token usage, and latency
4. **Use built-in middleware** - Leverage [`SummarizationMiddleware`](/oss/python/langchain/middleware#summarization), [`LLMToolSelectorMiddleware`](/oss/python/langchain/middleware#llm-tool-selector), etc.
5. **Document your context strategy** - Make it clear what context is being passed and why
6. **Understand transient vs persistent**: Model context changes are transient (per-call), while life-cycle context changes persist to state

## Related resources

* [Context conceptual overview](/oss/python/concepts/context) - Understand context types and when to use them
* [Middleware](/oss/python/langchain/middleware) - Complete middleware guide
* [Tools](/oss/python/langchain/tools) - Tool creation and context access
* [Memory](/oss/python/concepts/memory) - Short-term and long-term memory patterns
* [Agents](/oss/python/langchain/agents) - Core agent concepts

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/context-engineering.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


----------------------------------------------------https://docs.langchain.com/oss/python/langchain/mcp----------------------------------------------------https://docs.langchain.com/oss/python/langchain/mcp----------------------------------------------------https://docs.langchain.com/oss/python/langchain/mcp----------------------------------------------------https://docs.langchain.com/oss/python/langchain/mcp----------------------------------------------------https://docs.langchain.com/oss/python/langchain/mcp----------------------------------------------------https://docs.langchain.com/oss/python/langchain/mcp


# Model Context Protocol (MCP)

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) is an open protocol that standardizes how applications provide tools and context to LLMs. LangChain agents can use tools defined on MCP servers using the [`langchain-mcp-adapters`](https://github.com/langchain-ai/langchain-mcp-adapters) library.

## Install

Install the `langchain-mcp-adapters` library to use MCP tools in LangGraph:

<CodeGroup>
  ```bash pip theme={null}
  pip install langchain-mcp-adapters
  ```

  ```bash uv theme={null}
  uv add langchain-mcp-adapters
  ```
</CodeGroup>

## Transport types

MCP supports different transport mechanisms for client-server communication:

* **stdio** – Client launches server as a subprocess and communicates via standard input/output. Best for local tools and simple setups.
* **Streamable HTTP** – Server runs as an independent process handling HTTP requests. Supports remote connections and multiple clients.
* **Server-Sent Events (SSE)** – a variant of streamable HTTP optimized for real-time streaming communication.

## Use MCP tools

`langchain-mcp-adapters` enables agents to use tools defined across one or more MCP server.

```python Accessing multiple MCP servers icon="server" theme={null}
from langchain_mcp_adapters.client import MultiServerMCPClient  # [!code highlight]
from langchain.agents import create_agent


client = MultiServerMCPClient(  # [!code highlight]
    {
        "math": {
            "transport": "stdio",  # Local subprocess communication
            "command": "python",
            # Absolute path to your math_server.py file
            "args": ["/path/to/math_server.py"],
        },
        "weather": {
            "transport": "streamable_http",  # HTTP-based remote server
            # Ensure you start your weather server on port 8000
            "url": "http://localhost:8000/mcp",
        }
    }
)

tools = await client.get_tools()  # [!code highlight]
agent = create_agent(
    "claude-sonnet-4-5-20250929",
    tools  # [!code highlight]
)
math_response = await agent.ainvoke(
    {"messages": [{"role": "user", "content": "what's (3 + 5) x 12?"}]}
)
weather_response = await agent.ainvoke(
    {"messages": [{"role": "user", "content": "what is the weather in nyc?"}]}
)
```

<Note>
  `MultiServerMCPClient` is **stateless by default**. Each tool invocation creates a fresh MCP `ClientSession`, executes the tool, and then cleans up.
</Note>

## Custom MCP servers

To create your own MCP servers, you can use the `mcp` library. This library provides a simple way to define [tools](https://modelcontextprotocol.io/docs/learn/server-concepts#tools-ai-actions) and run them as servers.

<CodeGroup>
  ```bash pip theme={null}
  pip install mcp
  ```

  ```bash uv theme={null}
  uv add mcp
  ```
</CodeGroup>

Use the following reference implementations to test your agent with MCP tool servers.

```python title="Math server (stdio transport)" icon="floppy-disk" theme={null}
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Math")

@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

@mcp.tool()
def multiply(a: int, b: int) -> int:
    """Multiply two numbers"""
    return a * b

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

```python title="Weather server (streamable HTTP transport)" icon="wifi" theme={null}
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Weather")

@mcp.tool()
async def get_weather(location: str) -> str:
    """Get weather for location."""
    return "It's always sunny in New York"

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

## Stateful tool usage

For stateful servers that maintain context between tool calls, use `client.session()` to create a persistent `ClientSession`.

```python Using MCP ClientSession for stateful tool usage theme={null}
from langchain_mcp_adapters.tools import load_mcp_tools

client = MultiServerMCPClient({...})
async with client.session("math") as session:
    tools = await load_mcp_tools(session)
```

## Additional resources

* [MCP documentation](https://modelcontextprotocol.io/introduction)
* [MCP Transport documentation](https://modelcontextprotocol.io/docs/concepts/transports)
* [`langchain-mcp-adapters`](https://github.com/langchain-ai/langchain-mcp-adapters)

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/mcp.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


-----------------------------------https://docs.langchain.com/oss/python/langchain/human-in-the-loop-----------------------------------https://docs.langchain.com/oss/python/langchain/human-in-the-loop-----------------------------------https://docs.langchain.com/oss/python/langchain/human-in-the-loop-----------------------------------https://docs.langchain.com/oss/python/langchain/human-in-the-loop


# Human-in-the-loop

The Human-in-the-Loop (HITL) [middleware](/oss/python/langchain/middleware/built-in#human-in-the-loop) lets you add human oversight to agent tool calls.
When a model proposes an action that might require review — for example, writing to a file or executing SQL — the middleware can pause execution and wait for a decision.

It does this by checking each tool call against a configurable policy. If intervention is needed, the middleware issues an [interrupt](https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt) that halts execution. The graph state is saved using LangGraph's [persistence layer](/oss/python/langgraph/persistence), so execution can pause safely and resume later.

A human decision then determines what happens next: the action can be approved as-is (`approve`), modified before running (`edit`), or rejected with feedback (`reject`).

## Interrupt decision types

The [middleware](/oss/python/langchain/middleware/built-in#human-in-the-loop) defines three built-in ways a human can respond to an interrupt:

| Decision Type | Description                                                               | Example Use Case                                    |
| ------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| ✅ `approve`   | The action is approved as-is and executed without changes.                | Send an email draft exactly as written              |
| ✏️ `edit`     | The tool call is executed with modifications.                             | Change the recipient before sending an email        |
| ❌ `reject`    | The tool call is rejected, with an explanation added to the conversation. | Reject an email draft and explain how to rewrite it |

The available decision types for each tool depend on the policy you configure in `interrupt_on`.
When multiple tool calls are paused at the same time, each action requires a separate decision.
Decisions must be provided in the same order as the actions appear in the interrupt request.

<Tip>
  When **editing** tool arguments, make changes conservatively. Significant modifications to the original arguments may cause the model to re-evaluate its approach and potentially execute the tool multiple times or take unexpected actions.
</Tip>

## Configuring interrupts

To use HITL, add the [middleware](/oss/python/langchain/middleware/built-in#human-in-the-loop) to the agent's `middleware` list when creating the agent.

You configure it with a mapping of tool actions to the decision types that are allowed for each action. The middleware will interrupt execution when a tool call matches an action in the mapping.

```python  theme={null}
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware # [!code highlight]
from langgraph.checkpoint.memory import InMemorySaver # [!code highlight]


agent = create_agent(
    model="gpt-4o",
    tools=[write_file_tool, execute_sql_tool, read_data_tool],
    middleware=[
        HumanInTheLoopMiddleware( # [!code highlight]
            interrupt_on={
                "write_file": True,  # All decisions (approve, edit, reject) allowed
                "execute_sql": {"allowed_decisions": ["approve", "reject"]},  # No editing allowed
                # Safe operation, no approval needed
                "read_data": False,
            },
            # Prefix for interrupt messages - combined with tool name and args to form the full message
            # e.g., "Tool execution pending approval: execute_sql with query='DELETE FROM...'"
            # Individual tools can override this by specifying a "description" in their interrupt config
            description_prefix="Tool execution pending approval",
        ),
    ],
    # Human-in-the-loop requires checkpointing to handle interrupts.
    # In production, use a persistent checkpointer like AsyncPostgresSaver.
    checkpointer=InMemorySaver(),  # [!code highlight]
)
```

<Info>
  You must configure a checkpointer to persist the graph state across interrupts.
  In production, use a persistent checkpointer like [`AsyncPostgresSaver`](https://reference.langchain.com/python/langgraph/checkpoints/#langgraph.checkpoint.postgres.aio.AsyncPostgresSaver). For testing or prototyping, use [`InMemorySaver`](https://reference.langchain.com/python/langgraph/checkpoints/#langgraph.checkpoint.memory.InMemorySaver).

  When invoking the agent, pass a `config` that includes the **thread ID** to associate execution with a conversation thread.
  See the [LangGraph interrupts documentation](/oss/python/langgraph/interrupts) for details.
</Info>

<Accordion title="Configuration options">
  <ParamField body="interrupt_on" type="dict" required>
    Mapping of tool names to approval configs. Values can be `True` (interrupt with default config), `False` (auto-approve), or an `InterruptOnConfig` object.
  </ParamField>

  <ParamField body="description_prefix" type="string" default="Tool execution requires approval">
    Prefix for action request descriptions
  </ParamField>

  **`InterruptOnConfig` options:**

  <ParamField body="allowed_decisions" type="list[string]">
    List of allowed decisions: `'approve'`, `'edit'`, or `'reject'`
  </ParamField>

  <ParamField body="description" type="string | callable">
    Static string or callable function for custom description
  </ParamField>
</Accordion>

## Responding to interrupts

When you invoke the agent, it runs until it either completes or an interrupt is raised. An interrupt is triggered when a tool call matches the policy you configured in `interrupt_on`. In that case, the invocation result will include an `__interrupt__` field with the actions that require review. You can then present those actions to a reviewer and resume execution once decisions are provided.

```python  theme={null}
from langgraph.types import Command

# Human-in-the-loop leverages LangGraph's persistence layer.
# You must provide a thread ID to associate the execution with a conversation thread,
# so the conversation can be paused and resumed (as is needed for human review).
config = {"configurable": {"thread_id": "some_id"}} # [!code highlight]
# Run the graph until the interrupt is hit.
result = agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "Delete old records from the database",
            }
        ]
    },
    config=config # [!code highlight]
)

# The interrupt contains the full HITL request with action_requests and review_configs
print(result['__interrupt__'])
# > [
# >    Interrupt(
# >       value={
# >          'action_requests': [
# >             {
# >                'name': 'execute_sql',
# >                'arguments': {'query': 'DELETE FROM records WHERE created_at < NOW() - INTERVAL \'30 days\';'},
# >                'description': 'Tool execution pending approval\n\nTool: execute_sql\nArgs: {...}'
# >             }
# >          ],
# >          'review_configs': [
# >             {
# >                'action_name': 'execute_sql',
# >                'allowed_decisions': ['approve', 'reject']
# >             }
# >          ]
# >       }
# >    )
# > ]


# Resume with approval decision
agent.invoke(
    Command( # [!code highlight]
        resume={"decisions": [{"type": "approve"}]}  # or "edit", "reject" [!code highlight]
    ), # [!code highlight]
    config=config # Same thread ID to resume the paused conversation
)
```

### Decision types

<Tabs>
  <Tab title="✅ approve">
    Use `approve` to approve the tool call as-is and execute it without changes.

    ```python  theme={null}
    agent.invoke(
        Command(
            # Decisions are provided as a list, one per action under review.
            # The order of decisions must match the order of actions
            # listed in the `__interrupt__` request.
            resume={
                "decisions": [
                    {
                        "type": "approve",
                    }
                ]
            }
        ),
        config=config  # Same thread ID to resume the paused conversation
    )
    ```
  </Tab>

  <Tab title="✏️ edit">
    Use `edit` to modify the tool call before execution.
    Provide the edited action with the new tool name and arguments.

    ```python  theme={null}
    agent.invoke(
        Command(
            # Decisions are provided as a list, one per action under review.
            # The order of decisions must match the order of actions
            # listed in the `__interrupt__` request.
            resume={
                "decisions": [
                    {
                        "type": "edit",
                        # Edited action with tool name and args
                        "edited_action": {
                            # Tool name to call.
                            # Will usually be the same as the original action.
                            "name": "new_tool_name",
                            # Arguments to pass to the tool.
                            "args": {"key1": "new_value", "key2": "original_value"},
                        }
                    }
                ]
            }
        ),
        config=config  # Same thread ID to resume the paused conversation
    )
    ```

    <Tip>
      When **editing** tool arguments, make changes conservatively. Significant modifications to the original arguments may cause the model to re-evaluate its approach and potentially execute the tool multiple times or take unexpected actions.
    </Tip>
  </Tab>

  <Tab title="❌ reject">
    Use `reject` to reject the tool call and provide feedback instead of execution.

    ```python  theme={null}
    agent.invoke(
        Command(
            # Decisions are provided as a list, one per action under review.
            # The order of decisions must match the order of actions
            # listed in the `__interrupt__` request.
            resume={
                "decisions": [
                    {
                        "type": "reject",
                        # An explanation about why the action was rejected
                        "message": "No, this is wrong because ..., instead do this ...",
                    }
                ]
            }
        ),
        config=config  # Same thread ID to resume the paused conversation
    )
    ```

    The `message` is added to the conversation as feedback to help the agent understand why the action was rejected and what it should do instead.

    ***

    ### Multiple decisions

    When multiple actions are under review, provide a decision for each action in the same order as they appear in the interrupt:

    ```python  theme={null}
    {
        "decisions": [
            {"type": "approve"},
            {
                "type": "edit",
                "edited_action": {
                    "name": "tool_name",
                    "args": {"param": "new_value"}
                }
            },
            {
                "type": "reject",
                "message": "This action is not allowed"
            }
        ]
    }
    ```
  </Tab>
</Tabs>

## Execution lifecycle

The middleware defines an `after_model` hook that runs after the model generates a response but before any tool calls are executed:

1. The agent invokes the model to generate a response.
2. The middleware inspects the response for tool calls.
3. If any calls require human input, the middleware builds a `HITLRequest` with `action_requests` and `review_configs` and calls [interrupt](https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt).
4. The agent waits for human decisions.
5. Based on the `HITLResponse` decisions, the middleware executes approved or edited calls, synthesizes [ToolMessage](https://reference.langchain.com/python/langchain/messages/#langchain.messages.ToolMessage)'s for rejected calls, and resumes execution.

## Custom HITL logic

For more specialized workflows, you can build custom HITL logic directly using the [interrupt](https://reference.langchain.com/python/langgraph/types/#langgraph.types.interrupt) primitive and [middleware](/oss/python/langchain/middleware) abstraction.

Review the [execution lifecycle](#execution-lifecycle) above to understand how to integrate interrupts into the agent's operation.

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/human-in-the-loop.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


---------------------------------https://docs.langchain.com/oss/python/langchain/multi-agent---------------------------------https://docs.langchain.com/oss/python/langchain/multi-agent---------------------------------https://docs.langchain.com/oss/python/langchain/multi-agent---------------------------------https://docs.langchain.com/oss/python/langchain/multi-agent---------------------------------https://docs.langchain.com/oss/python/langchain/multi-agent


# Multi-agent

**Multi-agent systems** break a complex application into multiple specialized agents that work together to solve problems.
Instead of relying on a single agent to handle every step, **multi-agent architectures** allow you to compose smaller, focused agents into a coordinated workflow.

Multi-agent systems are useful when:

* A single agent has too many tools and makes poor decisions about which to use.
* Context or memory grows too large for one agent to track effectively.
* Tasks require **specialization** (e.g., a planner, researcher, math expert).

## Multi-agent patterns

| Pattern                           | How it works                                                                                                                                                     | Control flow                                               | Example use case                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| [**Tool Calling**](#tool-calling) | A **supervisor** agent calls other agents as *tools*. The “tool” agents don’t talk to the user directly — they just run their task and return results.           | Centralized: all routing passes through the calling agent. | Task orchestration, structured workflows.        |
| [**Handoffs**](#handoffs)         | The current agent decides to **transfer control** to another agent. The active agent changes, and the user may continue interacting directly with the new agent. | Decentralized: agents can change who is active.            | Multi-domain conversations, specialist takeover. |

<Card title="Tutorial: Build a supervisor agent" icon="sitemap" href="/oss/python/langchain/supervisor" arrow cta="Learn more">
  Learn how to build a personal assistant using the supervisor pattern, where a central supervisor agent coordinates specialized worker agents.
  This tutorial demonstrates:

  * Creating specialized sub-agents for different domains (calendar and email)
  * Wrapping sub-agents as tools for centralized orchestration
  * Adding human-in-the-loop review for sensitive actions
</Card>

## Choosing a pattern

| Question                                              | Tool Calling | Handoffs |
| ----------------------------------------------------- | ------------ | -------- |
| Need centralized control over workflow?               | ✅ Yes        | ❌ No     |
| Want agents to interact directly with the user?       | ❌ No         | ✅ Yes    |
| Complex, human-like conversation between specialists? | ❌ Limited    | ✅ Strong |

<Tip>
  You can mix both patterns — use **handoffs** for agent switching, and have each agent **call subagents as tools** for specialized tasks.
</Tip>

## Customizing agent context

At the heart of multi-agent design is **context engineering** - deciding what information each agent sees. LangChain gives you fine-grained control over:

* Which parts of the conversation or state are passed to each agent.
* Specialized prompts tailored to subagents.
* Inclusion/exclusion of intermediate reasoning.
* Customizing input/output formats per agent.

The quality of your system **heavily depends** on context engineering. The goal is to ensure that each agent has access to the correct data it needs to perform its task, whether it’s acting as a tool or as an active agent.

## Tool calling

In **tool calling**, one agent (the “**controller**”) treats other agents as *tools* to be invoked when needed. The controller manages orchestration, while tool agents perform specific tasks and return results.

Flow:

1. The **controller** receives input and decides which tool (subagent) to call.
2. The **tool agent** runs its task based on the controller’s instructions.
3. The **tool agent** returns results to the controller.
4. The **controller** decides the next step or finishes.

```mermaid  theme={null}
graph LR
    A[User] --> B[Controller Agent]
    B --> C[Tool Agent 1]
    B --> D[Tool Agent 2]
    C --> B
    D --> B
    B --> E[User Response]
```

<Tip>
  Agents used as tools are generally **not expected** to continue conversation with the user.
  Their role is to perform a task and return results to the controller agent.
  If you need subagents to be able to converse with the user, use **handoffs** instead.
</Tip>

### Implementation

Below is a minimal example where the main agent is given access to a single subagent via a tool definition:

```python  theme={null}
from langchain.tools import tool
from langchain.agents import create_agent


subagent1 = create_agent(model="...", tools=[...])

@tool(
    "subagent1_name",
    description="subagent1_description"
)
def call_subagent1(query: str):
    result = subagent1.invoke({
        "messages": [{"role": "user", "content": query}]
    })
    return result["messages"][-1].content

agent = create_agent(model="...", tools=[call_subagent1])
```

In this pattern:

1. The main agent invokes `call_subagent1` when it decides the task matches the subagent’s description.
2. The subagent runs independently and returns its result.
3. The main agent receives the result and continues orchestration.

### Where to customize

There are several points where you can control how context is passed between the main agent and its subagents:

1. **Subagent name** (`"subagent1_name"`): This is how the main agent refers to the subagent. Since it influences prompting, choose it carefully.
2. **Subagent description** (`"subagent1_description"`): This is what the main agent “knows” about the subagent. It directly shapes how the main agent decides when to call it.
3. **Input to the subagent**: You can customize this input to better shape how the subagent interprets tasks. In the example above, we pass the agent-generated `query` directly.
4. **Output from the subagent**: This is the **response** passed back to the main agent. You can adjust what is returned to control how the main agent interprets results. In the example above, we return the final message text, but you could return additional state or metadata.

### Control the input to the subagent

There are two main levers to control the input that the main agent passes to a subagent:

* **Modify the prompt** – Adjust the main agent's prompt or the tool metadata (i.e., sub-agent's name and description) to better guide when and how it calls the subagent.
* **Context injection** – Add input that isn’t practical to capture in a static prompt (e.g., full message history, prior results, task metadata) by adjusting the tool call to pull from the agent’s state.

```python  theme={null}
from langchain.agents import AgentState
from langchain.tools import tool, ToolRuntime

class CustomState(AgentState):
    example_state_key: str

@tool(
    "subagent1_name",
    description="subagent1_description"
)
def call_subagent1(query: str, runtime: ToolRuntime[None, CustomState]):
    # Apply any logic needed to transform the messages into a suitable input
    subagent_input = some_logic(query, runtime.state["messages"])
    result = subagent1.invoke({
        "messages": subagent_input,
        # You could also pass other state keys here as needed.
        # Make sure to define these in both the main and subagent's
        # state schemas.
        "example_state_key": runtime.state["example_state_key"]
    })
    return result["messages"][-1].content
```

### Control the output from the subagent

Two common strategies for shaping what the main agent receives back from a subagent:

* **Modify the prompt** – Refine the subagent’s prompt to specify exactly what should be returned.
  * Useful when outputs are incomplete, too verbose, or missing key details.
  * A common failure mode is that the subagent performs tool calls or reasoning but does **not include the results** in its final message. Remind it that the controller (and user) only see the final output, so all relevant info must be included there.
* **Custom output formatting** – adjust or enrich the subagent's response in code before handing it back to the main agent.
  * Example: pass specific state keys back to the main agent in addition to the final text.
  * This requires wrapping the result in a [`Command`](https://reference.langchain.com/python/langgraph/types/#langgraph.types.Command) (or equivalent structure) so you can merge custom state with the subagent’s response.

```python  theme={null}
from typing import Annotated
from langchain.agents import AgentState
from langchain.tools import InjectedToolCallId
from langgraph.types import Command


@tool(
    "subagent1_name",
    description="subagent1_description"
)
# We need to pass the `tool_call_id` to the sub agent so it can use it to respond with the tool call result
def call_subagent1(
    query: str,
    tool_call_id: Annotated[str, InjectedToolCallId],
# You need to return a `Command` object to include more than just a final tool call
) -> Command:
    result = subagent1.invoke({
        "messages": [{"role": "user", "content": query}]
    })
    return Command(update={
        # This is the example state key we are passing back
        "example_state_key": result["example_state_key"],
        "messages": [
            ToolMessage(
                content=result["messages"][-1].content,
                # We need to include the tool call id so it matches up with the right tool call
                tool_call_id=tool_call_id
            )
        ]
    })
```

## Handoffs

In **handoffs**, agents can directly pass control to each other. The “active” agent changes, and the user interacts with whichever agent currently has control.

Flow:

1. The **current agent** decides it needs help from another agent.
2. It passes control (and state) to the **next agent**.
3. The **new agent** interacts directly with the user until it decides to hand off again or finish.

```mermaid  theme={null}
graph LR
    A[User] --> B[Agent A]
    B --> C[Agent B]
    C --> A
```

### Implementation (Coming soon)

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/multi-agent.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


---------------------------------------------------------------------https://docs.langchain.com/oss/python/langchain/retrieval---------------------------------------------------------------------https://docs.langchain.com/oss/python/langchain/retrieval---------------------------------------------------------------------https://docs.langchain.com/oss/python/langchain/retrieval---------------------------------------------------------------------https://docs.langchain.com/oss/python/langchain/retrieval


# Retrieval

Large language models (LLMs) are powerful, but they have two key limitations:

* **Finite context** — they can’t ingest entire corpora at once.
* **Static knowledge** — their training data is frozen at a point in time.

Retrieval addresses these problems by fetching relevant external knowledge at query time. This is the foundation of **Retrieval-Augmented Generation (RAG)**: enhancing an LLM’s answers with context-specific information.

## Building a knowledge base

A **knowledge base** is a repository of documents or structured data used during retrieval.

If you need a custom knowledge base, you can use LangChain’s document loaders and vector stores to build one from your own data.

<Note>
  If you already have a knowledge base (e.g., a SQL database, CRM, or internal documentation system), you do **not** need to rebuild it. You can:

  * Connect it as a **tool** for an agent in Agentic RAG.
  * Query it and supply the retrieved content as context to the LLM [(2-Step RAG)](#2-step-rag).
</Note>

See the following tutorial to build a searchable knowledge base and minimal RAG workflow:

<Card title="Tutorial: Semantic search" icon="database" href="/oss/python/langchain/knowledge-base" arrow cta="Learn more">
  Learn how to create a searchable knowledge base from your own data using LangChain’s document loaders, embeddings, and vector stores.
  In this tutorial, you’ll build a search engine over a PDF, enabling retrieval of passages relevant to a query. You’ll also implement a minimal RAG workflow on top of this engine to see how external knowledge can be integrated into LLM reasoning.
</Card>

### From retrieval to RAG

Retrieval allows LLMs to access relevant context at runtime. But most real-world applications go one step further: they **integrate retrieval with generation** to produce grounded, context-aware answers.

This is the core idea behind **Retrieval-Augmented Generation (RAG)**. The retrieval pipeline becomes a foundation for a broader system that combines search with generation.

### Retrieval Pipeline

A typical retrieval workflow looks like this:

```mermaid  theme={null}
flowchart LR
  S(["Sources<br>(Google Drive, Slack, Notion, etc.)"]) --> L[Document Loaders]
  L --> A([Documents])
  A --> B[Split into chunks]
  B --> C[Turn into embeddings]
  C --> D[(Vector Store)]
  Q([User Query]) --> E[Query embedding]
  E --> D
  D --> F[Retriever]
  F --> G[LLM uses retrieved info]
  G --> H([Answer])
```

Each component is modular: you can swap loaders, splitters, embeddings, or vector stores without rewriting the app’s logic.

### Building Blocks

<Columns cols={2}>
  <Card title="Document loaders" icon="file-import" href="/oss/python/integrations/document_loaders" arrow cta="Learn more">
    Ingest data from external sources (Google Drive, Slack, Notion, etc.), returning standardized [`Document`](https://reference.langchain.com/python/langchain_core/documents/#langchain_core.documents.base.Document) objects.
  </Card>

  <Card title="Text splitters" icon="scissors" href="/oss/python/integrations/splitters" arrow cta="Learn more">
    Break large docs into smaller chunks that will be retrievable individually and fit within a model's context window.
  </Card>

  <Card title="Embedding models" icon="diagram-project" href="/oss/python/integrations/text_embedding" arrow cta="Learn more">
    An embedding model turns text into a vector of numbers so that texts with similar meaning land close together in that vector space.
  </Card>

  <Card title="Vector stores" icon="database" href="/oss/python/integrations/vectorstores/" arrow cta="Learn more">
    Specialized databases for storing and searching embeddings.
  </Card>

  <Card title="Retrievers" icon="binoculars" href="/oss/python/integrations/retrievers/" arrow cta="Learn more">
    A retriever is an interface that returns documents given an unstructured query.
  </Card>
</Columns>

## RAG Architectures

RAG can be implemented in multiple ways, depending on your system's needs. We outline each type in the sections below.

| Architecture    | Description                                                                | Control   | Flexibility | Latency    | Example Use Case                                  |
| --------------- | -------------------------------------------------------------------------- | --------- | ----------- | ---------- | ------------------------------------------------- |
| **2-Step RAG**  | Retrieval always happens before generation. Simple and predictable         | ✅ High    | ❌ Low       | ⚡ Fast     | FAQs, documentation bots                          |
| **Agentic RAG** | An LLM-powered agent decides *when* and *how* to retrieve during reasoning | ❌ Low     | ✅ High      | ⏳ Variable | Research assistants with access to multiple tools |
| **Hybrid**      | Combines characteristics of both approaches with validation steps          | ⚖️ Medium | ⚖️ Medium   | ⏳ Variable | Domain-specific Q\&A with quality validation      |

<Info>
  **Latency**: Latency is generally more **predictable** in **2-Step RAG**, as the maximum number of LLM calls is known and capped. This predictability assumes that LLM inference time is the dominant factor. However, real-world latency may also be affected by the performance of retrieval steps—such as API response times, network delays, or database queries—which can vary based on the tools and infrastructure in use.
</Info>

### 2-step RAG

In **2-Step RAG**, the retrieval step is always executed before the generation step. This architecture is straightforward and predictable, making it suitable for many applications where the retrieval of relevant documents is a clear prerequisite for generating an answer.

```mermaid  theme={null}
graph LR
    A[User Question] --> B["Retrieve Relevant Documents"]
    B --> C["Generate Answer"]
    C --> D[Return Answer to User]

    %% Styling
    classDef startend fill:#2e7d32,stroke:#1b5e20,stroke-width:2px,color:#fff
    classDef process fill:#1976d2,stroke:#0d47a1,stroke-width:1.5px,color:#fff

    class A,D startend
    class B,C process
```

<Card title="Tutorial: Retrieval-Augmented Generation (RAG)" icon="robot" href="/oss/python/langchain/rag#rag-chains" arrow cta="Learn more">
  See how to build a Q\&A chatbot that can answer questions grounded in your data using Retrieval-Augmented Generation.
  This tutorial walks through two approaches:

  * A **RAG agent** that runs searches with a flexible tool—great for general-purpose use.
  * A **2-step RAG** chain that requires just one LLM call per query—fast and efficient for simpler tasks.
</Card>

### Agentic RAG

**Agentic Retrieval-Augmented Generation (RAG)** combines the strengths of Retrieval-Augmented Generation with agent-based reasoning. Instead of retrieving documents before answering, an agent (powered by an LLM) reasons step-by-step and decides **when** and **how** to retrieve information during the interaction.

<Tip>
  The only thing an agent needs to enable RAG behavior is access to one or more **tools** that can fetch external knowledge — such as documentation loaders, web APIs, or database queries.
</Tip>

```mermaid  theme={null}
graph LR
    A[User Input / Question] --> B["Agent (LLM)"]
    B --> C{Need external info?}
    C -- Yes --> D["Search using tool(s)"]
    D --> H{Enough to answer?}
    H -- No --> B
    H -- Yes --> I[Generate final answer]
    C -- No --> I
    I --> J[Return to user]

    %% Dark-mode friendly styling
    classDef startend fill:#2e7d32,stroke:#1b5e20,stroke-width:2px,color:#fff
    classDef decision fill:#f9a825,stroke:#f57f17,stroke-width:2px,color:#000
    classDef process fill:#1976d2,stroke:#0d47a1,stroke-width:1.5px,color:#fff

    class A,J startend
    class B,D,I process
    class C,H decision
```

```python  theme={null}
import requests
from langchain.tools import tool
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent


@tool
def fetch_url(url: str) -> str:
    """Fetch text content from a URL"""
    response = requests.get(url, timeout=10.0)
    response.raise_for_status()
    return response.text

system_prompt = """\
Use fetch_url when you need to fetch information from a web-page; quote relevant snippets.
"""

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[fetch_url], # A tool for retrieval [!code highlight]
    system_prompt=system_prompt,
)
```

<Expandable title="Extended example: Agentic RAG for LangGraph's llms.txt">
  This example implements an **Agentic RAG system** to assist users in querying LangGraph documentation. The agent begins by loading [llms.txt](https://llmstxt.org/), which lists available documentation URLs, and can then dynamically use a `fetch_documentation` tool to retrieve and process the relevant content based on the user’s question.

  ```python  theme={null}
  import requests
  from langchain.agents import create_agent
  from langchain.messages import HumanMessage
  from langchain.tools import tool
  from markdownify import markdownify


  ALLOWED_DOMAINS = ["https://langchain-ai.github.io/"]
  LLMS_TXT = 'https://langchain-ai.github.io/langgraph/llms.txt'


  @tool
  def fetch_documentation(url: str) -> str:  # [!code highlight]
      """Fetch and convert documentation from a URL"""
      if not any(url.startswith(domain) for domain in ALLOWED_DOMAINS):
          return (
              "Error: URL not allowed. "
              f"Must start with one of: {', '.join(ALLOWED_DOMAINS)}"
          )
      response = requests.get(url, timeout=10.0)
      response.raise_for_status()
      return markdownify(response.text)


  # We will fetch the content of llms.txt, so this can
  # be done ahead of time without requiring an LLM request.
  llms_txt_content = requests.get(LLMS_TXT).text

  # System prompt for the agent
  system_prompt = f"""
  You are an expert Python developer and technical assistant.
  Your primary role is to help users with questions about LangGraph and related tools.

  Instructions:

  1. If a user asks a question you're unsure about — or one that likely involves API usage,
     behavior, or configuration — you MUST use the `fetch_documentation` tool to consult the relevant docs.
  2. When citing documentation, summarize clearly and include relevant context from the content.
  3. Do not use any URLs outside of the allowed domain.
  4. If a documentation fetch fails, tell the user and proceed with your best expert understanding.

  You can access official documentation from the following approved sources:

  {llms_txt_content}

  You MUST consult the documentation to get up to date documentation
  before answering a user's question about LangGraph.

  Your answers should be clear, concise, and technically accurate.
  """

  tools = [fetch_documentation]

  model = init_chat_model("claude-sonnet-4-0", max_tokens=32_000)

  agent = create_agent(
      model=model,
      tools=tools,  # [!code highlight]
      system_prompt=system_prompt,  # [!code highlight]
      name="Agentic RAG",
  )

  response = agent.invoke({
      'messages': [
          HumanMessage(content=(
              "Write a short example of a langgraph agent using the "
              "prebuilt create react agent. the agent should be able "
              "to look up stock pricing information."
          ))
      ]
  })

  print(response['messages'][-1].content)
  ```
</Expandable>

<Card title="Tutorial: Retrieval-Augmented Generation (RAG)" icon="robot" href="/oss/python/langchain/rag" arrow cta="Learn more">
  See how to build a Q\&A chatbot that can answer questions grounded in your data using Retrieval-Augmented Generation.
  This tutorial walks through two approaches:

  * A **RAG agent** that runs searches with a flexible tool—great for general-purpose use.
  * A **2-step RAG** chain that requires just one LLM call per query—fast and efficient for simpler tasks.
</Card>

### Hybrid RAG

Hybrid RAG combines characteristics of both 2-Step and Agentic RAG. It introduces intermediate steps such as query preprocessing, retrieval validation, and post-generation checks. These systems offer more flexibility than fixed pipelines while maintaining some control over execution.

Typical components include:

* **Query enhancement**: Modify the input question to improve retrieval quality. This can involve rewriting unclear queries, generating multiple variations, or expanding queries with additional context.
* **Retrieval validation**: Evaluate whether retrieved documents are relevant and sufficient. If not, the system may refine the query and retrieve again.
* **Answer validation**: Check the generated answer for accuracy, completeness, and alignment with source content. If needed, the system can regenerate or revise the answer.

The architecture often supports multiple iterations between these steps:

```mermaid  theme={null}
graph LR
    A[User Question] --> B[Query Enhancement]
    B --> C[Retrieve Documents]
    C --> D{Sufficient Info?}
    D -- No --> E[Refine Query]
    E --> C
    D -- Yes --> F[Generate Answer]
    F --> G{Answer Quality OK?}
    G -- No --> H{Try Different Approach?}
    H -- Yes --> E
    H -- No --> I[Return Best Answer]
    G -- Yes --> I
    I --> J[Return to User]

    classDef startend fill:#2e7d32,stroke:#1b5e20,stroke-width:2px,color:#fff
    classDef decision fill:#f9a825,stroke:#f57f17,stroke-width:2px,color:#000
    classDef process fill:#1976d2,stroke:#0d47a1,stroke-width:1.5px,color:#fff

    class A,J startend
    class B,C,E,F,I process
    class D,G,H decision
```

This architecture is suitable for:

* Applications with ambiguous or underspecified queries
* Systems that require validation or quality control steps
* Workflows involving multiple sources or iterative refinement

<Card title="Tutorial: Agentic RAG with Self-Correction" icon="robot" href="/oss/python/langgraph/agentic-rag" arrow cta="Learn more">
  An example of **Hybrid RAG** that combines agentic reasoning with retrieval and self-correction.
</Card>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/retrieval.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


------------------------------------https://docs.langchain.com/oss/python/langchain/long-term-memory------------------------------------https://docs.langchain.com/oss/python/langchain/long-term-memory------------------------------------https://docs.langchain.com/oss/python/langchain/long-term-memory------------------------------------https://docs.langchain.com/oss/python/langchain/long-term-memory



# Long-term memory

## Overview

LangChain agents use [LangGraph persistence](/oss/python/langgraph/persistence#memory-store) to enable long-term memory. This is a more advanced topic and requires knowledge of LangGraph to use.

## Memory storage

LangGraph stores long-term memories as JSON documents in a [store](/oss/python/langgraph/persistence#memory-store).

Each memory is organized under a custom `namespace` (similar to a folder) and a distinct `key` (like a file name). Namespaces often include user or org IDs or other labels that makes it easier to organize information.

This structure enables hierarchical organization of memories. Cross-namespace searching is then supported through content filters.

```python  theme={null}
from langgraph.store.memory import InMemoryStore


def embed(texts: list[str]) -> list[list[float]]:
    # Replace with an actual embedding function or LangChain embeddings object
    return [[1.0, 2.0] * len(texts)]


# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production use.
store = InMemoryStore(index={"embed": embed, "dims": 2}) # [!code highlight]
user_id = "my-user"
application_context = "chitchat"
namespace = (user_id, application_context) # [!code highlight]
store.put( # [!code highlight]
    namespace,
    "a-memory",
    {
        "rules": [
            "User likes short, direct language",
            "User only speaks English & python",
        ],
        "my-key": "my-value",
    },
)
# get the "memory" by ID
item = store.get(namespace, "a-memory") # [!code highlight]
# search for "memories" within this namespace, filtering on content equivalence, sorted by vector similarity
items = store.search( # [!code highlight]
    namespace, filter={"my-key": "my-value"}, query="language preferences"
)
```

For more information about the memory store, see the [Persistence](/oss/python/langgraph/persistence#memory-store) guide.

## Read long-term memory in tools

```python A tool the agent can use to look up user information theme={null}
from dataclasses import dataclass

from langchain_core.runnables import RunnableConfig
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime
from langgraph.store.memory import InMemoryStore


@dataclass
class Context:
    user_id: str

# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.
store = InMemoryStore() # [!code highlight]

# Write sample data to the store using the put method
store.put( # [!code highlight]
    ("users",),  # Namespace to group related data together (users namespace for user data)
    "user_123",  # Key within the namespace (user ID as key)
    {
        "name": "John Smith",
        "language": "English",
    }  # Data to store for the given user
)

@tool
def get_user_info(runtime: ToolRuntime[Context]) -> str:
    """Look up user info."""
    # Access the store - same as that provided to `create_agent`
    store = runtime.store # [!code highlight]
    user_id = runtime.context.user_id
    # Retrieve data from store - returns StoreValue object with value and metadata
    user_info = store.get(("users",), user_id) # [!code highlight]
    return str(user_info.value) if user_info else "Unknown user"

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[get_user_info],
    # Pass store to agent - enables agent to access store when running tools
    store=store, # [!code highlight]
    context_schema=Context
)

# Run the agent
agent.invoke(
    {"messages": [{"role": "user", "content": "look up user information"}]},
    context=Context(user_id="user_123") # [!code highlight]
)
```

<a id="write-long-term" />

## Write long-term memory from tools

```python Example of a tool that updates user information theme={null}
from dataclasses import dataclass
from typing_extensions import TypedDict

from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime
from langgraph.store.memory import InMemoryStore


# InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production.
store = InMemoryStore() # [!code highlight]

@dataclass
class Context:
    user_id: str

# TypedDict defines the structure of user information for the LLM
class UserInfo(TypedDict):
    name: str

# Tool that allows agent to update user information (useful for chat applications)
@tool
def save_user_info(user_info: UserInfo, runtime: ToolRuntime[Context]) -> str:
    """Save user info."""
    # Access the store - same as that provided to `create_agent`
    store = runtime.store # [!code highlight]
    user_id = runtime.context.user_id # [!code highlight]
    # Store data in the store (namespace, key, data)
    store.put(("users",), user_id, user_info) # [!code highlight]
    return "Successfully saved user info."

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[save_user_info],
    store=store, # [!code highlight]
    context_schema=Context
)

# Run the agent
agent.invoke(
    {"messages": [{"role": "user", "content": "My name is John Smith"}]},
    # user_id passed in context to identify whose information is being updated
    context=Context(user_id="user_123") # [!code highlight]
)

# You can access the store directly to get the value
store.get(("users",), "user_123").value
```

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/long-term-memory.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt



-------------------------------------------------https://docs.langchain.com/oss/python/langchain/studio-------------------------------------------------https://docs.langchain.com/oss/python/langchain/studio-------------------------------------------------https://docs.langchain.com/oss/python/langchain/studio-------------------------------------------------https://docs.langchain.com/oss/python/langchain/studio


# LangSmith Studio

When building agents with LangChain locally, it's helpful to visualize what's happening inside your agent, interact with it in real-time, and debug issues as they occur. **LangSmith Studio** is a free visual interface for developing and testing your LangChain agents from your local machine.

Studio connects to your locally running agent to show you each step your agent takes: the prompts sent to the model, tool calls and their results, and the final output. You can test different inputs, inspect intermediate states, and iterate on your agent's behavior without additional code or deployment.

This pages describes how to set up Studio with your local LangChain agent.

## Prerequisites

Before you begin, ensure you have the following:

* **A LangSmith account**: Sign up (for free) or log in at [smith.langchain.com](https://smith.langchain.com).
* **A LangSmith API key**: Follow the [Create an API key](/langsmith/create-account-api-key#create-an-api-key) guide.
* If you don't want data [traced](/langsmith/observability-concepts#traces) to LangSmith, set `LANGSMITH_TRACING=false` in your application's `.env` file. With tracing disabled, no data leaves your local server.

## Set up local Agent server

### 1. Install the LangGraph CLI

The [LangGraph CLI](/langsmith/cli) provides a local development server (also called [Agent Server](/langsmith/agent-server)) that connects your agent to Studio.

```shell  theme={null}
# Python >= 3.11 is required.
pip install --upgrade "langgraph-cli[inmem]"
```

### 2. Prepare your agent

If you already have a LangChain agent, you can use it directly. This example uses a simple email agent:

```python title="agent.py" theme={null}
from langchain.agents import create_agent

def send_email(to: str, subject: str, body: str):
    """Send an email"""
    email = {
        "to": to,
        "subject": subject,
        "body": body
    }
    # ... email sending logic

    return f"Email sent to {to}"

agent = create_agent(
    "gpt-4o",
    tools=[send_email],
    system_prompt="You are an email assistant. Always use the send_email tool.",
)
```

### 3. Environment variables

Studio requires a LangSmith API key to connect your local agent. Create a `.env` file in the root of your project and add your API key from [LangSmith](https://smith.langchain.com/settings).

<Warning>
  Ensure your `.env` file is not committed to version control, such as Git.
</Warning>

```bash .env theme={null}
LANGSMITH_API_KEY=lsv2...
```

### 4. Create a LangGraph config file

The LangGraph CLI uses a configuration file to locate your agent and manage dependencies. Create a `langgraph.json` file in your app's directory:

```json title="langgraph.json" theme={null}
{
  "dependencies": ["."],
  "graphs": {
    "agent": "./src/agent.py:agent"
  },
  "env": ".env"
}
```

The [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) function automatically returns a compiled LangGraph graph, which is what the `graphs` key expects in the configuration file.

<Info>
  For detailed explanations of each key in the JSON object of the configuration file, refer to the [LangGraph configuration file reference](/langsmith/cli#configuration-file).
</Info>

At this point, the project structure will look like this:

```bash  theme={null}
my-app/
├── src
│   └── agent.py
├── .env
└── langgraph.json
```

### 5. Install dependencies

Install your project dependencies from the root directory:

<CodeGroup>
  ```shell pip theme={null}
  pip install -e .
  ```

  ```shell uv theme={null}
  uv sync
  ```
</CodeGroup>

### 6. View your agent in Studio

Start the development server to connect your agent to Studio:

```shell  theme={null}
langgraph dev
```

<Warning>
  Safari blocks `localhost` connections to Studio. To work around this, run the above command with `--tunnel` to access Studio via a secure tunnel.
</Warning>

Once the server is running, your agent is accessible both via API at `http://127.0.0.1:2024` and through the Studio UI at `https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024`:

<Frame>
    <img src="https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=ebd259e9fa24af7d011dfcc568f74be2" alt="Agent view in the Studio UI" data-og-width="2836" width="2836" data-og-height="1752" height="1752" data-path="oss/images/studio_create-agent.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=280&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=cf9c05bdd08661d4d546c540c7a28cbe 280w, https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=560&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=484b2fd56957d048bd89280ce97065a0 560w, https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=840&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=92991302ac24604022ab82ac22729f68 840w, https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=1100&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=ed366abe8dabc42a9d7c300a591e1614 1100w, https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=1650&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=d5865d3c4b0d26e9d72e50d474547a63 1650w, https://mintcdn.com/langchain-5e9cc07a/TCDks4pdsHdxWmuJ/oss/images/studio_create-agent.png?w=2500&fit=max&auto=format&n=TCDks4pdsHdxWmuJ&q=85&s=6b254add2df9cc3c10ac0c2bcb3a589c 2500w" />
</Frame>

With Studio connected to your local agent, you can iterate quickly on your agent's behavior. Run a test input, inspect the full execution trace including prompts, tool arguments, return values, and token/latency metrics. When something goes wrong, Studio captures exceptions with the surrounding state to help you understand what happened.

The development server supports hot-reloading—make changes to prompts or tool signatures in your code, and Studio reflects them immediately. Re-run conversation threads from any step to test your changes without starting over. This workflow scales from simple single-tool agents to complex multi-node graphs.

For more information on how to run Studio, refer to the following guides in the [LangSmith docs](/langsmith/home):

* [Run application](/langsmith/use-studio#run-application)
* [Manage assistants](/langsmith/use-studio#manage-assistants)
* [Manage threads](/langsmith/use-studio#manage-threads)
* [Iterate on prompts](/langsmith/observability-studio)
* [Debug LangSmith traces](/langsmith/observability-studio#debug-langsmith-traces)
* [Add node to dataset](/langsmith/observability-studio#add-node-to-dataset)

## Video guide

<Frame>
  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/Mi1gSlHwZLM?si=zA47TNuTC5aH0ahd" title="Studio" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
</Frame>

<Tip>
  For more information about local and deployed agents, see [Set up local Agent Server](/oss/python/langchain/studio#setup-local-agent-server) and [Deploy](/oss/python/langchain/deploy).
</Tip>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/studio.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt



------------------------------------------------https://docs.langchain.com/oss/python/langchain/test------------------------------------------------https://docs.langchain.com/oss/python/langchain/test------------------------------------------------https://docs.langchain.com/oss/python/langchain/test------------------------------------------------https://docs.langchain.com/oss/python/langchain/test------------------------------------------------https://docs.langchain.com/oss/python/langchain/test



# Test

Agentic applications let an LLM decide its own next steps to solve a problem. That flexibility is powerful, but the model's black-box nature makes it hard to predict how a tweak in one part of your agent will affect the rest. To build production-ready agents, thorough testing is essential.

There are a few approaches to testing your agents:

* [Unit tests](#unit-testing) exercise small, deterministic pieces of your agent in isolation using in-memory fakes so you can assert exact behavior quickly and deterministically.

* [Integration tests](#integration-testing) test the agent using real network calls to confirm that components work together, credentials and schemas line up, and latency is acceptable.

Agentic applications tend to lean more on integration because they chain multiple components together and must deal with flakiness due to the nondeterministic nature of LLMs.

## Unit Testing

### Mocking Chat Model

For logic not requiring API calls, you can use an in-memory stub for mocking responses.

LangChain provides [`GenericFakeChatModel`](https://python.langchain.com/api_reference/core/language_models/langchain_core.language_models.fake_chat_models.GenericFakeChatModel.html) for mocking text responses. It accepts an iterator of responses (AIMessages or strings) and returns one per invocation. It supports both regular and streaming usage.

```python  theme={null}
from langchain_core.language_models.fake_chat_models import GenericFakeChatModel

model = GenericFakeChatModel(messages=iter([
    AIMessage(content="", tool_calls=[ToolCall(name="foo", args={"bar": "baz"}, id="call_1")]),
    "bar"
]))

model.invoke("hello")
# AIMessage(content='', ..., tool_calls=[{'name': 'foo', 'args': {'bar': 'baz'}, 'id': 'call_1', 'type': 'tool_call'}])
```

If we invoke the model again, it will return the next item in the iterator:

```python  theme={null}
model.invoke("hello, again!")
# AIMessage(content='bar', ...)
```

### InMemorySaver Checkpointer

To enable persistence during testing, you can use the [`InMemorySaver`](https://reference.langchain.com/python/langgraph/checkpoints/#langgraph.checkpoint.memory.InMemorySaver) checkpointer. This allows you to simulate multiple turns to test state-dependent behavior:

```python  theme={null}
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    model,
    tools=[],
    checkpointer=InMemorySaver()
)

# First invocation
agent.invoke(HumanMessage(content="I live in Sydney, Australia."))

# Second invocation: the first message is persisted (Sydney location), so the model returns GMT+10 time
agent.invoke(HumanMessage(content="What's my local time?"))
```

## Integration Testing

Many agent behaviors only emerge when using a real LLM, such as which tool the agent decides to call, how it formats responses, or whether a prompt modification affects the entire execution trajectory. LangChain's [`agentevals`](https://github.com/langchain-ai/agentevals) package provides evaluators specifically designed for testing agent trajectories with live models.

AgentEvals lets you easily evaluate the trajectory of your agent (the exact sequence of messages, including tool calls) by performing a **trajectory match** or by using an **LLM judge**:

<Card title="Trajectory match" icon="equals" arrow="true" href="#trajectory-match-evaluator">
  Hard-code a reference trajectory for a given input and validate the run via a step-by-step comparison.

  Ideal for testing well-defined workflows where you know the expected behavior. Use when you have specific expectations about which tools should be called and in what order. This approach is deterministic, fast, and cost-effective since it doesn't require additional LLM calls.
</Card>

<Card title="LLM-as-judge" icon="gavel" arrow="true" href="#llm-as-judge-evaluator">
  Use a LLM to qualitatively validate your agent's execution trajectory. The "judge" LLM reviews the agent's decisions against a prompt rubric (which can include a reference trajectory).

  More flexible and can assess nuanced aspects like efficiency and appropriateness, but requires an LLM call and is less deterministic. Use when you want to evaluate the overall quality and reasonableness of the agent's trajectory without strict tool call or ordering requirements.
</Card>

### Installing AgentEvals

```bash  theme={null}
pip install agentevals
```

Or, clone the [AgentEvals repository](https://github.com/langchain-ai/agentevals) directly.

### Trajectory Match Evaluator

AgentEvals offers the `create_trajectory_match_evaluator` function to match your agent's trajectory against a reference trajectory. There are four modes to choose from:

| Mode        | Description                                               | Use Case                                                              |
| ----------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| `strict`    | Exact match of messages and tool calls in the same order  | Testing specific sequences (e.g., policy lookup before authorization) |
| `unordered` | Same tool calls allowed in any order                      | Verifying information retrieval when order doesn't matter             |
| `subset`    | Agent calls only tools from reference (no extras)         | Ensuring agent doesn't exceed expected scope                          |
| `superset`  | Agent calls at least the reference tools (extras allowed) | Verifying minimum required actions are taken                          |

<Accordion title="Strict match">
  The `strict` mode ensures trajectories contain identical messages in the same order with the same tool calls, though it allows for differences in message content. This is useful when you need to enforce a specific sequence of operations, such as requiring a policy lookup before authorizing an action.

  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.tools import tool
  from langchain.messages import HumanMessage, AIMessage, ToolMessage
  from agentevals.trajectory.match import create_trajectory_match_evaluator


  @tool
  def get_weather(city: str):
      """Get weather information for a city."""
      return f"It's 75 degrees and sunny in {city}."

  agent = create_agent("gpt-4o", tools=[get_weather])

  evaluator = create_trajectory_match_evaluator(  # [!code highlight]
      trajectory_match_mode="strict",  # [!code highlight]
  )  # [!code highlight]

  def test_weather_tool_called_strict():
      result = agent.invoke({
          "messages": [HumanMessage(content="What's the weather in San Francisco?")]
      })

      reference_trajectory = [
          HumanMessage(content="What's the weather in San Francisco?"),
          AIMessage(content="", tool_calls=[
              {"id": "call_1", "name": "get_weather", "args": {"city": "San Francisco"}}
          ]),
          ToolMessage(content="It's 75 degrees and sunny in San Francisco.", tool_call_id="call_1"),
          AIMessage(content="The weather in San Francisco is 75 degrees and sunny."),
      ]

      evaluation = evaluator(
          outputs=result["messages"],
          reference_outputs=reference_trajectory
      )
      # {
      #     'key': 'trajectory_strict_match',
      #     'score': True,
      #     'comment': None,
      # }
      assert evaluation["score"] is True
  ```
</Accordion>

<Accordion title="Unordered match">
  The `unordered` mode allows the same tool calls in any order, which is helpful when you want to verify that specific information was retrieved but don't care about the sequence. For example, an agent might need to check both weather and events for a city, but the order doesn't matter.

  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.tools import tool
  from langchain.messages import HumanMessage, AIMessage, ToolMessage
  from agentevals.trajectory.match import create_trajectory_match_evaluator


  @tool
  def get_weather(city: str):
      """Get weather information for a city."""
      return f"It's 75 degrees and sunny in {city}."

  @tool
  def get_events(city: str):
      """Get events happening in a city."""
      return f"Concert at the park in {city} tonight."

  agent = create_agent("gpt-4o", tools=[get_weather, get_events])

  evaluator = create_trajectory_match_evaluator(  # [!code highlight]
      trajectory_match_mode="unordered",  # [!code highlight]
  )  # [!code highlight]

  def test_multiple_tools_any_order():
      result = agent.invoke({
          "messages": [HumanMessage(content="What's happening in SF today?")]
      })

      # Reference shows tools called in different order than actual execution
      reference_trajectory = [
          HumanMessage(content="What's happening in SF today?"),
          AIMessage(content="", tool_calls=[
              {"id": "call_1", "name": "get_events", "args": {"city": "SF"}},
              {"id": "call_2", "name": "get_weather", "args": {"city": "SF"}},
          ]),
          ToolMessage(content="Concert at the park in SF tonight.", tool_call_id="call_1"),
          ToolMessage(content="It's 75 degrees and sunny in SF.", tool_call_id="call_2"),
          AIMessage(content="Today in SF: 75 degrees and sunny with a concert at the park tonight."),
      ]

      evaluation = evaluator(
          outputs=result["messages"],
          reference_outputs=reference_trajectory,
      )
      # {
      #     'key': 'trajectory_unordered_match',
      #     'score': True,
      # }
      assert evaluation["score"] is True
  ```
</Accordion>

<Accordion title="Subset and superset match">
  The `superset` and `subset` modes match partial trajectories. The `superset` mode verifies that the agent called at least the tools in the reference trajectory, allowing additional tool calls. The `subset` mode ensures the agent did not call any tools beyond those in the reference.

  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.tools import tool
  from langchain.messages import HumanMessage, AIMessage, ToolMessage
  from agentevals.trajectory.match import create_trajectory_match_evaluator


  @tool
  def get_weather(city: str):
      """Get weather information for a city."""
      return f"It's 75 degrees and sunny in {city}."

  @tool
  def get_detailed_forecast(city: str):
      """Get detailed weather forecast for a city."""
      return f"Detailed forecast for {city}: sunny all week."

  agent = create_agent("gpt-4o", tools=[get_weather, get_detailed_forecast])

  evaluator = create_trajectory_match_evaluator(  # [!code highlight]
      trajectory_match_mode="superset",  # [!code highlight]
  )  # [!code highlight]

  def test_agent_calls_required_tools_plus_extra():
      result = agent.invoke({
          "messages": [HumanMessage(content="What's the weather in Boston?")]
      })

      # Reference only requires get_weather, but agent may call additional tools
      reference_trajectory = [
          HumanMessage(content="What's the weather in Boston?"),
          AIMessage(content="", tool_calls=[
              {"id": "call_1", "name": "get_weather", "args": {"city": "Boston"}},
          ]),
          ToolMessage(content="It's 75 degrees and sunny in Boston.", tool_call_id="call_1"),
          AIMessage(content="The weather in Boston is 75 degrees and sunny."),
      ]

      evaluation = evaluator(
          outputs=result["messages"],
          reference_outputs=reference_trajectory,
      )
      # {
      #     'key': 'trajectory_superset_match',
      #     'score': True,
      #     'comment': None,
      # }
      assert evaluation["score"] is True
  ```
</Accordion>

<Info>
  You can also set the `tool_args_match_mode` property and/or `tool_args_match_overrides` to customize how the evaluator considers equality between tool calls in the actual trajectory vs. the reference. By default, only tool calls with the same arguments to the same tool are considered equal. Visit the [repository](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#tool-args-match-modes) for more details.
</Info>

### LLM-as-Judge Evaluator

You can also use an LLM to evaluate the agent's execution path with the `create_trajectory_llm_as_judge` function. Unlike the trajectory match evaluators, it doesn't require a reference trajectory, but one can be provided if available.

<Accordion title="Without reference trajectory">
  ```python  theme={null}
  from langchain.agents import create_agent
  from langchain.tools import tool
  from langchain.messages import HumanMessage, AIMessage, ToolMessage
  from agentevals.trajectory.llm import create_trajectory_llm_as_judge, TRAJECTORY_ACCURACY_PROMPT


  @tool
  def get_weather(city: str):
      """Get weather information for a city."""
      return f"It's 75 degrees and sunny in {city}."

  agent = create_agent("gpt-4o", tools=[get_weather])

  evaluator = create_trajectory_llm_as_judge(  # [!code highlight]
      model="openai:o3-mini",  # [!code highlight]
      prompt=TRAJECTORY_ACCURACY_PROMPT,  # [!code highlight]
  )  # [!code highlight]

  def test_trajectory_quality():
      result = agent.invoke({
          "messages": [HumanMessage(content="What's the weather in Seattle?")]
      })

      evaluation = evaluator(
          outputs=result["messages"],
      )
      # {
      #     'key': 'trajectory_accuracy',
      #     'score': True,
      #     'comment': 'The provided agent trajectory is reasonable...'
      # }
      assert evaluation["score"] is True
  ```
</Accordion>

<Accordion title="With reference trajectory">
  If you have a reference trajectory, you can add an extra variable to your prompt and pass in the reference trajectory. Below, we use the prebuilt `TRAJECTORY_ACCURACY_PROMPT_WITH_REFERENCE` prompt and configure the `reference_outputs` variable:

  ```python  theme={null}
  evaluator = create_trajectory_llm_as_judge(
      model="openai:o3-mini",
      prompt=TRAJECTORY_ACCURACY_PROMPT_WITH_REFERENCE,
  )
  evaluation = judge_with_reference(
      outputs=result["messages"],
      reference_outputs=reference_trajectory,
  )
  ```
</Accordion>

<Info>
  For more configurability over how the LLM evaluates the trajectory, visit the [repository](https://github.com/langchain-ai/agentevals?tab=readme-ov-file#trajectory-llm-as-judge).
</Info>

### Async Support

All `agentevals` evaluators support Python asyncio. For evaluators that use factory functions, async versions are available by adding `async` after `create_` in the function name.

<Accordion title="Async judge and evaluator example">
  ```python  theme={null}
  from agentevals.trajectory.llm import create_async_trajectory_llm_as_judge, TRAJECTORY_ACCURACY_PROMPT
  from agentevals.trajectory.match import create_async_trajectory_match_evaluator

  async_judge = create_async_trajectory_llm_as_judge(
      model="openai:o3-mini",
      prompt=TRAJECTORY_ACCURACY_PROMPT,
  )

  async_evaluator = create_async_trajectory_match_evaluator(
      trajectory_match_mode="strict",
  )

  async def test_async_evaluation():
      result = await agent.ainvoke({
          "messages": [HumanMessage(content="What's the weather?")]
      })

      evaluation = await async_judge(outputs=result["messages"])
      assert evaluation["score"] is True
  ```
</Accordion>

## LangSmith Integration

For tracking experiments over time, you can log evaluator results to [LangSmith](https://smith.langchain.com/), a platform for building production-grade LLM applications that includes tracing, evaluation, and experimentation tools.

First, set up LangSmith by setting the required environment variables:

```bash  theme={null}
export LANGSMITH_API_KEY="your_langsmith_api_key"
export LANGSMITH_TRACING="true"
```

LangSmith offers two main approaches for running evaluations: [pytest](/langsmith/pytest) integration and the `evaluate` function.

<Accordion title="Using pytest integration">
  ```python  theme={null}
  import pytest
  from langsmith import testing as t
  from agentevals.trajectory.llm import create_trajectory_llm_as_judge, TRAJECTORY_ACCURACY_PROMPT

  trajectory_evaluator = create_trajectory_llm_as_judge(
      model="openai:o3-mini",
      prompt=TRAJECTORY_ACCURACY_PROMPT,
  )

  @pytest.mark.langsmith
  def test_trajectory_accuracy():
      result = agent.invoke({
          "messages": [HumanMessage(content="What's the weather in SF?")]
      })

      reference_trajectory = [
          HumanMessage(content="What's the weather in SF?"),
          AIMessage(content="", tool_calls=[
              {"id": "call_1", "name": "get_weather", "args": {"city": "SF"}},
          ]),
          ToolMessage(content="It's 75 degrees and sunny in SF.", tool_call_id="call_1"),
          AIMessage(content="The weather in SF is 75 degrees and sunny."),
      ]

      # Log inputs, outputs, and reference outputs to LangSmith
      t.log_inputs({})
      t.log_outputs({"messages": result["messages"]})
      t.log_reference_outputs({"messages": reference_trajectory})

      trajectory_evaluator(
          outputs=result["messages"],
          reference_outputs=reference_trajectory
      )
  ```

  Run the evaluation with pytest:

  ```bash  theme={null}
  pytest test_trajectory.py --langsmith-output
  ```

  Results will be automatically logged to LangSmith.
</Accordion>

<Accordion title="Using the evaluate function">
  Alternatively, you can create a dataset in LangSmith and use the `evaluate` function:

  ```python  theme={null}
  from langsmith import Client
  from agentevals.trajectory.llm import create_trajectory_llm_as_judge, TRAJECTORY_ACCURACY_PROMPT

  client = Client()

  trajectory_evaluator = create_trajectory_llm_as_judge(
      model="openai:o3-mini",
      prompt=TRAJECTORY_ACCURACY_PROMPT,
  )

  def run_agent(inputs):
      """Your agent function that returns trajectory messages."""
      return agent.invoke(inputs)["messages"]

  experiment_results = client.evaluate(
      run_agent,
      data="your_dataset_name",
      evaluators=[trajectory_evaluator]
  )
  ```

  Results will be automatically logged to LangSmith.
</Accordion>

<Tip>
  To learn more about evaluating your agent, see the [LangSmith docs](/langsmith/pytest).
</Tip>

## Recording & Replaying HTTP Calls

Integration tests that call real LLM APIs can be slow and expensive, especially when run frequently in CI/CD pipelines. We recommend using a library for recording HTTP requests and responses, then replaying them in subsequent runs without making actual network calls.

You can use [`vcrpy`](https://pypi.org/project/vcrpy/1.5.2/) to achieve this. If you're using `pytest`, the [`pytest-recording` plugin](https://pypi.org/project/pytest-recording/) provides a simple way to enable this with minimal configuration. Request/responses are recorded in cassettes, which are then used to mock the real network calls in subsequent runs.

Set up your `conftest.py` file to filter out sensitive information from the cassettes:

```py conftest.py theme={null}
import pytest

@pytest.fixture(scope="session")
def vcr_config():
    return {
        "filter_headers": [
            ("authorization", "XXXX"),
            ("x-api-key", "XXXX"),
            # ... other headers you want to mask
        ],
        "filter_query_parameters": [
            ("api_key", "XXXX"),
            ("key", "XXXX"),
        ],
    }
```

Then configure your project to recognise the `vcr` marker:

<CodeGroup>
  ```ini pytest.ini theme={null}
  [pytest]
  markers =
      vcr: record/replay HTTP via VCR
  addopts = --record-mode=once
  ```

  ```toml pyproject.toml theme={null}
  [tool.pytest.ini_options]
  markers = [
    "vcr: record/replay HTTP via VCR"
  ]
  addopts = "--record-mode=once"
  ```
</CodeGroup>

<Info>
  The `--record-mode=once` option records HTTP interactions on the first run and replays them on subsequent runs.
</Info>

Now, simply decorate your tests with the `vcr` marker:

```python  theme={null}
@pytest.mark.vcr()
def test_agent_trajectory():
    # ...
```

The first time you run this test, your agent will make real network calls and pytest will generate a cassette file `test_agent_trajectory.yaml` in the `tests/cassettes` directory. Subsequent runs will use that cassette to mock the real network calls, granted the agent's requests don't change from the previous run. If they do, the test will fail and you'll need to delete the cassette and rerun the test to record fresh interactions.

<Warning>
  When you modify prompts, add new tools, or change expected trajectories, your saved cassettes will become outdated and your existing tests **will fail**. You should delete the corresponding cassette files and rerun the tests to record fresh interactions.
</Warning>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/test.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt



----------------------------------------------------https://docs.langchain.com/oss/python/langchain/ui----------------------------------------------------https://docs.langchain.com/oss/python/langchain/ui----------------------------------------------------https://docs.langchain.com/oss/python/langchain/ui----------------------------------------------------https://docs.langchain.com/oss/python/langchain/ui----------------------------------------------------https://docs.langchain.com/oss/python/langchain/ui


# Agent Chat UI

LangChain provides a powerful prebuilt user interface that work seamlessly with agents created using [`create_agent`](/oss/python/langchain/agents). This UI is designed to provide rich, interactive experiences for your agents with minimal setup, whether you're running locally or in a deployed context (such as [LangSmith](/langsmith/)).

## Agent Chat UI

[Agent Chat UI](https://github.com/langchain-ai/agent-chat-ui) is a Next.js application that provides a conversational interface for interacting with any LangChain agent. It supports real-time chat, tool visualization, and advanced features like time-travel debugging and state forking.

Agent Chat UI is open source and can be adapted to your application needs.

<Frame>
  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/lInrwVnZ83o?si=Uw66mPtCERJm0EjU" title="Agent Chat UI" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
</Frame>

### Features

<Accordion title="Tool visualization">
  Studio automatically renders tool calls and results in an intuitive interface.

  <Frame>
    <img src="https://mintlify.s3.us-west-1.amazonaws.com/langchain-5e9cc07a/oss/images/studio_tools.gif" alt="Tool visualization in Studio" />
  </Frame>
</Accordion>

<Accordion title="Time-travel debugging">
  Navigate through conversation history and fork from any point

  <Frame>
    <img src="https://mintlify.s3.us-west-1.amazonaws.com/langchain-5e9cc07a/oss/images/studio_fork.gif" alt="Time-travel debugging in Studio" />
  </Frame>
</Accordion>

<Accordion title="State inspection">
  View and modify agent state at any point during execution

  <Frame>
    <img src="https://mintlify.s3.us-west-1.amazonaws.com/langchain-5e9cc07a/oss/images/studio_state.gif" alt="State inspection in Studio" />
  </Frame>
</Accordion>

<Accordion title="Human-in-the-loop">
  Built-in support for reviewing and responding to agent requests

  <Frame>
    <img src="https://mintlify.s3.us-west-1.amazonaws.com/langchain-5e9cc07a/oss/images/studio_hitl.gif" alt="Human-in-the-Loop in Studio" />
  </Frame>
</Accordion>

<Tip>
  You can use generative UI in the Agent Chat UI. For more information, see [Implement generative user interfaces with LangGraph](/langsmith/generative-ui-react).
</Tip>

### Quick start

The fastest way to get started is using the hosted version:

1. **Visit [Agent Chat UI](https://agentchat.vercel.app)**
2. **Connect your agent** by entering your deployment URL or local server address
3. **Start chatting** - the UI will automatically detect and render tool calls and interrupts

### Local development

For customization or local development, you can run Agent Chat UI locally:

<CodeGroup>
  ```bash Use npx theme={null} theme={null}
  # Create a new Agent Chat UI project
  npx create-agent-chat-app --project-name my-chat-ui
  cd my-chat-ui

  # Install dependencies and start
  pnpm install
  pnpm dev
  ```

  ```bash Clone repository theme={null} theme={null}
  # Clone the repository
  git clone https://github.com/langchain-ai/agent-chat-ui.git
  cd agent-chat-ui

  # Install dependencies and start
  pnpm install
  pnpm dev
  ```
</CodeGroup>

### Connect to your agent

Agent Chat UI can connect to both [local](/oss/python/langchain/studio#setup-local-agent-server) and [deployed agents](/oss/python/langchain/deploy).

After starting Agent Chat UI, you'll need to configure it to connect to your agent:

1. **Graph ID**: Enter your graph name (find this under `graphs` in your `langgraph.json` file)
2. **Deployment URL**: Your Agent server's endpoint (e.g., `http://localhost:2024` for local development, or your deployed agent's URL)
3. **LangSmith API key (optional)**: Add your LangSmith API key (not required if you're using a local Agent server)

Once configured, Agent Chat UI will automatically fetch and display any interrupted threads from your agent.

<Tip>
  Agent Chat UI has out-of-the-box support for rendering tool calls and tool result messages. To customize what messages are shown, see [Hiding Messages in the Chat](https://github.com/langchain-ai/agent-chat-ui?tab=readme-ov-file#hiding-messages-in-the-chat).
</Tip>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/ui.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


-----------------------------------------------https://docs.langchain.com/oss/python/langchain/deploy-----------------------------------------------https://docs.langchain.com/oss/python/langchain/deploy-----------------------------------------------https://docs.langchain.com/oss/python/langchain/deploy-----------------------------------------------https://docs.langchain.com/oss/python/langchain/deploy-----------------------------------------------https://docs.langchain.com/oss/python/langchain/deploy-----------------------------------------------https://docs.langchain.com/oss/python/langchain/deploy


# LangSmith Deployment

When you're ready to deploy your LangChain agent to production, LangSmith provides a managed hosting platform designed for agent workloads. Traditional hosting platforms are built for stateless, short-lived web applications, while LangGraph is **purpose-built for stateful, long-running agents** that require persistent state and background execution. LangSmith handles the infrastructure, scaling, and operational concerns so you can deploy directly from your repository.

## Prerequisites

Before you begin, ensure you have the following:

* A [GitHub account](https://github.com/)
* A [LangSmith account](https://smith.langchain.com/) (free to sign up)

## Deploy your agent

### 1. Create a repository on GitHub

Your application's code must reside in a GitHub repository to be deployed on LangSmith. Both public and private repositories are supported. For this quickstart, first make sure your app is LangGraph-compatible by following the [local server setup guide](/oss/python/langchain/studio#setup-local-agent-server). Then, push your code to the repository.

### 2. Deploy to LangSmith

<Steps>
  <Step title="Navigate to LangSmith Deployments">
    Log in to [LangSmith](https://smith.langchain.com/). In the left sidebar, select **Deployments**.
  </Step>

  <Step title="Create new deployment">
    Click the **+ New Deployment** button. A pane will open where you can fill in the required fields.
  </Step>

  <Step title="Link repository">
    If you are a first time user or adding a private repository that has not been previously connected, click the **Add new account** button and follow the instructions to connect your GitHub account.
  </Step>

  <Step title="Deploy repository">
    Select your application's repository. Click **Submit** to deploy. This may take about 15 minutes to complete. You can check the status in the **Deployment details** view.
  </Step>
</Steps>

### 3. Test your application in Studio

Once your application is deployed:

1. Select the deployment you just created to view more details.
2. Click the **Studio** button in the top right corner. Studio will open to display your graph.

### 4. Get the API URL for your deployment

1. In the **Deployment details** view in LangGraph, click the **API URL** to copy it to your clipboard.
2. Click the `URL` to copy it to the clipboard.

### 5. Test the API

You can now test the API:

<Tabs>
  <Tab title="Python">
    1. Install LangGraph Python:

    ```shell  theme={null}
    pip install langgraph-sdk
    ```

    2. Send a message to the agent:

    ```python  theme={null}
    from langgraph_sdk import get_sync_client # or get_client for async

    client = get_sync_client(url="your-deployment-url", api_key="your-langsmith-api-key")

    for chunk in client.runs.stream(
        None,    # Threadless run
        "agent", # Name of agent. Defined in langgraph.json.
        input={
            "messages": [{
                "role": "human",
                "content": "What is LangGraph?",
            }],
        },
        stream_mode="updates",
    ):
        print(f"Receiving new event of type: {chunk.event}...")
        print(chunk.data)
        print("\n\n")
    ```
  </Tab>

  <Tab title="Rest API">
    ```bash  theme={null}
    curl -s --request POST \
        --url <DEPLOYMENT_URL>/runs/stream \
        --header 'Content-Type: application/json' \
        --header "X-Api-Key: <LANGSMITH API KEY> \
        --data "{
            \"assistant_id\": \"agent\", `# Name of agent. Defined in langgraph.json.`
            \"input\": {
                \"messages\": [
                    {
                        \"role\": \"human\",
                        \"content\": \"What is LangGraph?\"
                    }
                ]
            },
            \"stream_mode\": \"updates\"
        }"
    ```
  </Tab>
</Tabs>

<Tip>
  LangSmith offers additional hosting options, including self-hosted and hybrid. For more information, please see the [Platform setup overview](/langsmith/platform-setup).
</Tip>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/deploy.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt


---------------------------------------https://docs.langchain.com/oss/python/langchain/observability---------------------------------------https://docs.langchain.com/oss/python/langchain/observability---------------------------------------https://docs.langchain.com/oss/python/langchain/observability---------------------------------------https://docs.langchain.com/oss/python/langchain/observability---------------------------------------https://docs.langchain.com/oss/python/langchain/observability---------------------------------------https://docs.langchain.com/oss/python/langchain/observability



# LangSmith Observability

As you build and run agents with LangChain, you need visibility into how they behave: which [tools](/oss/python/langchain/tools) they call, what prompts they generate, and how they make decisions. LangChain agents built with [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent) automatically support tracing through [LangSmith](/langsmith/home), a platform for capturing, debugging, evaluating, and monitoring LLM application behavior.

[*Traces*](/langsmith/observability-concepts#traces) record every step of your agent's execution, from the initial user input to the final response, including all tool calls, model interactions, and decision points. This execution data helps you debug issues, evaluate performance across different inputs, and monitor usage patterns in production.

This guide shows you how to enable tracing for your LangChain agents and use LangSmith to analyze their execution.

## Prerequisites

Before you begin, ensure you have the following:

* **A LangSmith account**: Sign up (for free) or log in at [smith.langchain.com](https://smith.langchain.com).
* **A LangSmith API key**: Follow the [Create an API key](/langsmith/create-account-api-key#create-an-api-key) guide.

## Enable tracing

All LangChain agents automatically support LangSmith tracing. To enable it, set the following environment variables:

```bash  theme={null}
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=<your-api-key>
```

## Quickstart

No extra code is needed to log a trace to LangSmith. Just run your agent code as you normally would:

```python  theme={null}
from langchain.agents import create_agent


def send_email(to: str, subject: str, body: str):
    """Send an email to a recipient."""
    # ... email sending logic
    return f"Email sent to {to}"

def search_web(query: str):
    """Search the web for information."""
    # ... web search logic
    return f"Search results for: {query}"

agent = create_agent(
    model="gpt-4o",
    tools=[send_email, search_web],
    system_prompt="You are a helpful assistant that can send emails and search the web."
)

# Run the agent - all steps will be traced automatically
response = agent.invoke({
    "messages": [{"role": "user", "content": "Search for the latest AI news and email a summary to john@example.com"}]
})
```

By default, the trace will be logged to the project with the name `default`. To configure a custom project name, see [Log to a project](#log-to-a-project).

## Trace selectively

You may opt to trace specific invocations or parts of your application using LangSmith's `tracing_context` context manager:

```python  theme={null}
import langsmith as ls

# This WILL be traced
with ls.tracing_context(enabled=True):
    agent.invoke({"messages": [{"role": "user", "content": "Send a test email to alice@example.com"}]})

# This will NOT be traced (if LANGSMITH_TRACING is not set)
agent.invoke({"messages": [{"role": "user", "content": "Send another email"}]})
```

## Log to a project

<Accordion title="Statically">
  You can set a custom project name for your entire application by setting the `LANGSMITH_PROJECT` environment variable:

  ```bash  theme={null}
  export LANGSMITH_PROJECT=my-agent-project
  ```
</Accordion>

<Accordion title="Dynamically">
  You can set the project name programmatically for specific operations:

  ```python  theme={null}
  import langsmith as ls

  with ls.tracing_context(project_name="email-agent-test", enabled=True):
      response = agent.invoke({
          "messages": [{"role": "user", "content": "Send a welcome email"}]
      })
  ```
</Accordion>

## Add metadata to traces

You can annotate your traces with custom metadata and tags:

```python  theme={null}
response = agent.invoke(
    {"messages": [{"role": "user", "content": "Send a welcome email"}]},
    config={
        "tags": ["production", "email-assistant", "v1.0"],
        "metadata": {
            "user_id": "user_123",
            "session_id": "session_456",
            "environment": "production"
        }
    }
)
```

`tracing_context` also accepts tags and metadata for fine-grained control:

```python  theme={null}
with ls.tracing_context(
    project_name="email-agent-test",
    enabled=True,
    tags=["production", "email-assistant", "v1.0"],
    metadata={"user_id": "user_123", "session_id": "session_456", "environment": "production"}):
    response = agent.invoke(
        {"messages": [{"role": "user", "content": "Send a welcome email"}]}
    )
```

This custom metadata and tags will be attached to the trace in LangSmith.

<Tip>
  To learn more about how to use traces to debug, evaluate, and monitor your agents, see the [LangSmith documentation](/langsmith/home).
</Tip>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/observability.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt



-------------------------------https://docs.langchain.com/oss/python/integrations/providers/overview-------------------------------https://docs.langchain.com/oss/python/integrations/providers/overview-------------------------------https://docs.langchain.com/oss/python/integrations/providers/overview-------------------------------https://docs.langchain.com/oss/python/integrations/providers/overview-------------------------------https://docs.langchain.com/oss/python/integrations/providers/overview



# Integration packages

{/* Do not manually edit */}

LangChain Python offers an extensive ecosystem with 1000+ integrations across chat & embedding models, tools & toolkits, document loaders, vector stores, and more.

<Columns cols={3}>
  <Card title="Chat models" icon="message" href="/oss/python/integrations/chat" arrow />

  <Card title="Embedding models" icon="layer-group" href="/oss/python/integrations/text_embedding" arrow />

  <Card title="Tools and toolkits" icon="screwdriver-wrench" href="/oss/python/integrations/tools" arrow />
</Columns>

To see a full list of integrations by component type, refer to the categories in the sidebar.

## Popular providers

| Provider                                                            | Package                                                                                                               | Downloads                                                                                                                                                                                                                         | Latest version                                                                                                                                                                                                                                           | <Tooltip tip="Whether an equivalent version exists in the TypeScript version of LangChain. Click the checkmark to visit the respective package.">JS/TS support</Tooltip> |
| :------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [OpenAI](/oss/python/integrations/providers/openai/)                | [`langchain-openai`](https://reference.langchain.com/python/integrations/langchain_openai/)                           | <a href="https://pypi.org/project/langchain-openai/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-openai/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                           | <a href="https://pypi.org/project/langchain-openai/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-openai?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                           | [✅](https://www.npmjs.com/package/@langchain/openai)                                                                                                                     |
| [Google (Vertex AI)](/oss/python/integrations/providers/google)     | [`langchain-google-vertexai`](https://reference.langchain.com/python/integrations/langchain_google_vertexai/)         | <a href="https://pypi.org/project/langchain-google-vertexai/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-google-vertexai/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>         | <a href="https://pypi.org/project/langchain-google-vertexai/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-google-vertexai?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>         | [✅](https://www.npmjs.com/package/@langchain/google-vertexai)                                                                                                            |
| [Anthropic (Claude)](/oss/python/integrations/providers/anthropic/) | [`langchain-anthropic`](https://reference.langchain.com/python/integrations/langchain_anthropic/)                     | <a href="https://pypi.org/project/langchain-anthropic/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-anthropic/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                     | <a href="https://pypi.org/project/langchain-anthropic/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-anthropic?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                     | [✅](https://www.npmjs.com/package/@langchain/anthropic)                                                                                                                  |
| [AWS](/oss/python/integrations/providers/aws/)                      | [`langchain-aws`](https://reference.langchain.com/python/integrations/langchain_aws/)                                 | <a href="https://pypi.org/project/langchain-aws/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-aws/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                                 | <a href="https://pypi.org/project/langchain-aws/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-aws?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                                 | [✅](https://www.npmjs.com/package/@langchain/aws)                                                                                                                        |
| [Google (GenAI)](/oss/python/integrations/providers/google)         | [`langchain-google-genai`](https://reference.langchain.com/python/integrations/langchain_google_genai/)               | <a href="https://pypi.org/project/langchain-google-genai/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-google-genai/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>               | <a href="https://pypi.org/project/langchain-google-genai/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-google-genai?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>               | [✅](https://www.npmjs.com/package/@langchain/google-genai)                                                                                                               |
| [Groq](/oss/python/integrations/providers/groq/)                    | [`langchain-groq`](https://reference.langchain.com/python/integrations/langchain_groq/)                               | <a href="https://pypi.org/project/langchain-groq/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-groq/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                               | <a href="https://pypi.org/project/langchain-groq/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-groq?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                               | [✅](https://www.npmjs.com/package/@langchain/groq)                                                                                                                       |
| [Ollama](/oss/python/integrations/providers/ollama/)                | [`langchain-ollama`](https://reference.langchain.com/python/integrations/langchain_ollama/)                           | <a href="https://pypi.org/project/langchain-ollama/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-ollama/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                           | <a href="https://pypi.org/project/langchain-ollama/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-ollama?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                           | [✅](https://www.npmjs.com/package/@langchain/ollama)                                                                                                                     |
| [Chroma](/oss/python/integrations/providers/chroma/)                | [`langchain-chroma`](https://reference.langchain.com/python/integrations/langchain_chroma/)                           | <a href="https://pypi.org/project/langchain-chroma/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-chroma/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                           | <a href="https://pypi.org/project/langchain-chroma/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-chroma?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                           | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [Huggingface](/oss/python/integrations/providers/huggingface/)      | [`langchain-huggingface`](https://reference.langchain.com/python/integrations/langchain_huggingface/)                 | <a href="https://pypi.org/project/langchain-huggingface/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-huggingface/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                 | <a href="https://pypi.org/project/langchain-huggingface/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-huggingface?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                 | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [Pinecone](/oss/python/integrations/providers/pinecone/)            | [`langchain-pinecone`](https://reference.langchain.com/python/integrations/langchain_pinecone/)                       | <a href="https://pypi.org/project/langchain-pinecone/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-pinecone/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                       | <a href="https://pypi.org/project/langchain-pinecone/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-pinecone?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                       | [✅](https://www.npmjs.com/package/@langchain/pinecone)                                                                                                                   |
| [Cohere](/oss/python/integrations/providers/cohere/)                | [`langchain-cohere`](https://reference.langchain.com/python/integrations/langchain_cohere/)                           | <a href="https://pypi.org/project/langchain-cohere/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-cohere/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                           | <a href="https://pypi.org/project/langchain-cohere/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-cohere?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                           | [✅](https://www.npmjs.com/package/@langchain/cohere)                                                                                                                     |
| [Postgres](/oss/python/integrations/providers/pgvector)             | [`langchain-postgres`](https://reference.langchain.com/python/integrations/langchain_postgres/)                       | <a href="https://pypi.org/project/langchain-postgres/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-postgres/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                       | <a href="https://pypi.org/project/langchain-postgres/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-postgres?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                       | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [Fireworks](/oss/python/integrations/providers/fireworks/)          | [`langchain-fireworks`](https://reference.langchain.com/python/integrations/langchain_fireworks/)                     | <a href="https://pypi.org/project/langchain-fireworks/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-fireworks/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                     | <a href="https://pypi.org/project/langchain-fireworks/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-fireworks?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                     | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [MistralAI](/oss/python/integrations/providers/mistralai/)          | [`langchain-mistralai`](https://reference.langchain.com/python/integrations/langchain_mistralai/)                     | <a href="https://pypi.org/project/langchain-mistralai/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-mistralai/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                     | <a href="https://pypi.org/project/langchain-mistralai/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-mistralai?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                     | [✅](https://www.npmjs.com/package/@langchain/mistralai)                                                                                                                  |
| [Databricks](/oss/python/integrations/providers/databricks/)        | [`databricks-langchain`](https://pypi.org/project/databricks-langchain/)                                              | <a href="https://pypi.org/project/databricks-langchain/" target="_blank"><img src="https://static.pepy.tech/badge/databricks-langchain/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                   | <a href="https://pypi.org/project/databricks-langchain/" target="_blank"><img src="https://img.shields.io/pypi/v/databricks-langchain?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                   | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [Perplexity](/oss/python/integrations/providers/perplexity/)        | [`langchain-perplexity`](https://reference.langchain.com/python/integrations/langchain_perplexity/)                   | <a href="https://pypi.org/project/langchain-perplexity/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-perplexity/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                   | <a href="https://pypi.org/project/langchain-perplexity/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-perplexity?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                   | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [IBM](/oss/python/integrations/providers/ibm/)                      | [`langchain-ibm`](https://reference.langchain.com/python/integrations/langchain_ibm/)                                 | <a href="https://pypi.org/project/langchain-ibm/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-ibm/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                                 | <a href="https://pypi.org/project/langchain-ibm/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-ibm?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                                 | [✅](https://www.npmjs.com/package/@langchain/ibm)                                                                                                                        |
| [Nvidia AI Endpoints](/oss/python/integrations/providers/nvidia)    | [`langchain-nvidia-ai-endpoints`](https://reference.langchain.com/python/integrations/langchain_nvidia_ai_endpoints/) | <a href="https://pypi.org/project/langchain-nvidia-ai-endpoints/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-nvidia-ai-endpoints/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a> | <a href="https://pypi.org/project/langchain-nvidia-ai-endpoints/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-nvidia-ai-endpoints?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a> | ❌                                                                                                                                                                        |
| [MongoDB](/oss/python/integrations/providers/mongodb_atlas)         | [`langchain-mongodb`](https://reference.langchain.com/python/integrations/langchain_mongodb/)                         | <a href="https://pypi.org/project/langchain-mongodb/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-mongodb/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                         | <a href="https://pypi.org/project/langchain-mongodb/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-mongodb?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                         | [✅](https://www.npmjs.com/package/@langchain/mongodb)                                                                                                                    |
| [Deepseek](/oss/python/integrations/providers/deepseek/)            | [`langchain-deepseek`](https://reference.langchain.com/python/integrations/langchain_deepseek/)                       | <a href="https://pypi.org/project/langchain-deepseek/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-deepseek/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                       | <a href="https://pypi.org/project/langchain-deepseek/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-deepseek?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                       | [✅](https://www.npmjs.com/package/@langchain/deepseek)                                                                                                                   |
| [Qdrant](/oss/python/integrations/providers/qdrant/)                | [`langchain-qdrant`](https://reference.langchain.com/python/integrations/langchain_qdrant/)                           | <a href="https://pypi.org/project/langchain-qdrant/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-qdrant/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                           | <a href="https://pypi.org/project/langchain-qdrant/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-qdrant?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                           | [✅](https://www.npmjs.com/package/@langchain/qdrant)                                                                                                                     |
| [Milvus](/oss/python/integrations/providers/milvus/)                | [`langchain-milvus`](https://reference.langchain.com/python/integrations/langchain_milvus/)                           | <a href="https://pypi.org/project/langchain-milvus/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-milvus/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                           | <a href="https://pypi.org/project/langchain-milvus/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-milvus?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                           | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [Tavily](/oss/python/integrations/providers/tavily/)                | [`langchain-tavily`](https://pypi.org/project/langchain-tavily/)                                                      | <a href="https://pypi.org/project/langchain-tavily/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-tavily/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                           | <a href="https://pypi.org/project/langchain-tavily/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-tavily?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                           | [✅](https://www.npmjs.com/package/@langchain/tavily)                                                                                                                     |
| [Elasticsearch](/oss/python/integrations/providers/elasticsearch/)  | [`langchain-elasticsearch`](https://reference.langchain.com/python/integrations/langchain_elasticsearch/)             | <a href="https://pypi.org/project/langchain-elasticsearch/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-elasticsearch/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>             | <a href="https://pypi.org/project/langchain-elasticsearch/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-elasticsearch?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>             | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [Together](/oss/python/integrations/providers/together/)            | [`langchain-together`](https://reference.langchain.com/python/integrations/langchain_together/)                       | <a href="https://pypi.org/project/langchain-together/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-together/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                       | <a href="https://pypi.org/project/langchain-together/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-together?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                       | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [Redis](/oss/python/integrations/providers/redis/)                  | [`langchain-redis`](https://reference.langchain.com/python/integrations/langchain_redis/)                             | <a href="https://pypi.org/project/langchain-redis/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-redis/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                             | <a href="https://pypi.org/project/langchain-redis/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-redis?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                             | [✅](https://www.npmjs.com/package/@langchain/redis)                                                                                                                      |
| [LiteLLM](/oss/python/integrations/providers/litellm/)              | [`langchain-litellm`](https://pypi.org/project/langchain-litellm/)                                                    | <a href="https://pypi.org/project/langchain-litellm/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-litellm/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                         | <a href="https://pypi.org/project/langchain-litellm/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-litellm?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                         | N/A                                                                                                                                                                      |
| [xAI (Grok)](/oss/python/integrations/providers/xai/)               | [`langchain-xai`](https://reference.langchain.com/python/integrations/langchain_xai/)                                 | <a href="https://pypi.org/project/langchain-xai/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-xai/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                                 | <a href="https://pypi.org/project/langchain-xai/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-xai?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                                 | [✅](https://www.npmjs.com/package/@langchain/xai)                                                                                                                        |
| [DataStax Astra DB](/oss/python/integrations/providers/astradb/)    | [`langchain-astradb`](https://reference.langchain.com/python/integrations/langchain_astradb/)                         | <a href="https://pypi.org/project/langchain-astradb/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-astradb/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                         | <a href="https://pypi.org/project/langchain-astradb/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-astradb?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                         | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [Azure AI](/oss/python/integrations/providers/azure_ai)             | [`langchain-azure-ai`](https://reference.langchain.com/python/integrations/langchain_azure_ai/)                       | <a href="https://pypi.org/project/langchain-azure-ai/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-azure-ai/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                       | <a href="https://pypi.org/project/langchain-azure-ai/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-azure-ai?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                       | [✅](https://www.npmjs.com/package/@langchain/openai)                                                                                                                     |
| [MCP Toolbox (Google)](/oss/python/integrations/providers/toolbox/) | [`toolbox-langchain`](https://pypi.org/project/toolbox-langchain/)                                                    | <a href="https://pypi.org/project/toolbox-langchain/" target="_blank"><img src="https://static.pepy.tech/badge/toolbox-langchain/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                         | <a href="https://pypi.org/project/toolbox-langchain/" target="_blank"><img src="https://img.shields.io/pypi/v/toolbox-langchain?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                         | ❌                                                                                                                                                                        |
| [Google (Community)](/oss/python/integrations/providers/google)     | [`langchain-google-community`](https://reference.langchain.com/python/integrations/langchain_google_community/)       | <a href="https://pypi.org/project/langchain-google-community/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-google-community/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>       | <a href="https://pypi.org/project/langchain-google-community/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-google-community?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>       | ❌                                                                                                                                                                        |
| [Unstructured](/oss/python/integrations/providers/unstructured/)    | [`langchain-unstructured`](https://reference.langchain.com/python/integrations/langchain_unstructured/)               | <a href="https://pypi.org/project/langchain-unstructured/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-unstructured/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>               | <a href="https://pypi.org/project/langchain-unstructured/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-unstructured?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>               | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [Neo4J](/oss/python/integrations/providers/neo4j/)                  | [`langchain-neo4j`](https://reference.langchain.com/python/integrations/langchain_neo4j/)                             | <a href="https://pypi.org/project/langchain-neo4j/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-neo4j/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>                             | <a href="https://pypi.org/project/langchain-neo4j/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-neo4j?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>                             | [✅](https://www.npmjs.com/package/@langchain/community)                                                                                                                  |
| [Graph RAG](/oss/python/integrations/providers/graph_rag)           | [`langchain-graph-retriever`](https://pypi.org/project/langchain-graph-retriever/)                                    | <a href="https://pypi.org/project/langchain-graph-retriever/" target="_blank"><img src="https://static.pepy.tech/badge/langchain-graph-retriever/month" alt="Downloads per month" noZoom class="rounded not-prose" /></a>         | <a href="https://pypi.org/project/langchain-graph-retriever/" target="_blank"><img src="https://img.shields.io/pypi/v/langchain-graph-retriever?style=flat-square&label=%20" alt="PyPI - Latest version" noZoom class="rounded not-prose" /></a>         | ❌                                                                                                                                                                        |

## All providers

[See all providers](/oss/python/integrations/providers/all_providers) or search for a provider using the search field.

Community integrations can be found in [`langchain-community`](https://github.com/langchain-ai/langchain-community).

<Info>
  If you'd like to contribute an integration, see the [contributing guide](/oss/python/contributing).
</Info>

***

<Callout icon="pen-to-square" iconType="regular">
  [Edit the source of this page on GitHub.](https://github.com/langchain-ai/docs/edit/main/src/oss/python/integrations/providers/overview.mdx)
</Callout>

<Tip icon="terminal" iconType="regular">
  [Connect these docs programmatically](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.langchain.com/llms.txt