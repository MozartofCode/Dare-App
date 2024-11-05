# @Author: Bertan Berker
# @Language: Python
# This is a file with dare app AI agents
# The agents are used to suggest a dare and evaluate a dare

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


# This function creates and uses an AI agent to suggest a dare to the user
# :param: None
# :return: The dare suggested by the agent
def suggest_dare():
    
    # Defining the Tools
    search_tool = SerperDevTool()
    scrape_tool = ScrapeWebsiteTool()

    # AGENTS
    suggest_dare = Agent(
        role="Dare Suggestor Agent",
        goal="Suggest a dare to the user",
        backstory="Specializing coming up with fun and slightly challenging dares for the game of truth or dare, this agent uses online"
        " resources and common sense to create a dare that is fun and safe",
        verbose=True,
        allow_delegation=False,
        tools =[scrape_tool, search_tool]
    )

   
    # TASKS    
    suggest = Task(
        description=(
            "Suggest a dare to the user. The agent should provide a dare that is fun and safe"
        ),
        expected_output=(
            "One sentence answer suggesting a dare that is fun and safe in the format: 'I dare you to ...'"
        ),
        agent= suggest_dare
    )

    # Define the crew with agents and tasks
    dare_crew = Crew(
        agents=[suggest_dare],
        tasks=[suggest],
        manager_llm=ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7),
        verbose=True
    )

    # RUN
    result = dare_crew.kickoff()
    return result


# This function creates and uses an AI agent to evaluate a dare (safe or not)
# :param: dare_comment: The dare to be evaluated
# :return: The evaluation of the dare (safe or not)
def evaluate_dare(dare_comment):
        
    # Defining the Tools
    search_tool = SerperDevTool()
    scrape_tool = ScrapeWebsiteTool()

    # AGENTS
    evaluate_dare = Agent(
        role="Dare Evaluator Agent",
        goal="Evaluates the {dare} suggested by the person",
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
    dare_crew = Crew(
        agents=[evaluate_dare],
        tasks=[evaluate],
        manager_llm=ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7),
        verbose=True
    )

    dare = {'dare': dare_comment}

    # RUN
    result = dare_crew.kickoff(inputs=dare)
    return result



# TODO evaluate a dare and see if the dare is done by a person (video-image recognition??)

def check_completion(video_path, dare_prompt):
    pass

def interpret_video(video_path):
    pass
