# @Author: Bertan Berker
# @Language: Python
# This is a dare app AI agent that makes sure the proposed dare is nothing harmful or illegal

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from crewai import Agent, Task, Crew, Process
from crewai_tools import ScrapeWebsiteTool, SerperDevTool
import warnings
warnings.filterwarnings('ignore')
import os
from pydantic import BaseModel


load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')
serper_api_key = os.getenv('SERPER_API_KEY')
os.environ["OPENAI_MODEL_NAME"] = 'gpt-3.5-turbo'

# TODO suggest a dare
# TODO evaluate a dare and see if the dare is done by a person (video-image recognition??)


def dare_agent(dare_comment):
        
    # Defining the Tools
    search_tool = SerperDevTool()
    scrape_tool = ScrapeWebsiteTool()

    # AGENTS
    evaluate_dare = Agent(
        role="Dare Evaluator Agent",
        goal="Evaluates the {dare} suggested by the person and ",
        backstory="Specializing understanding the harmful and legal implications of a dare by some person, this agent uses online"
        " resources and common sense to confirm the {dare} is safe and legal.",
        verbose=True,
        allow_delegation=False,
        tools =[scrape_tool, search_tool]
    )


    # TASKS
    evaluate = Task(
        description=(
            "Evaluate the given {dare} to confirm it is safe and legal or not. The agent should provide a one word answer"
        ),
        expected_output=(
            "One word answer confirming if the dare is safe or not. Ex: 'Safe', 'Not Safe'"
        ),
        agent= evaluate_dare
    )

    # Define the crew with agents and tasks
    poker_crew = Crew(
        agents=[evaluate_dare],
        tasks=[evaluate],
        manager_llm=ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7),
        process=Process.sequential,
        verbose=True
    )

    dare = {'dare': dare_comment}
    # RUN
    result = poker_crew.kickoff(inputs=dare)
    return result



print(dare_agent("I dare you to eat an apple"))