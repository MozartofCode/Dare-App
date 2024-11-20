# @Author: Bertan Berker
# @Language: Python
# This is a file with dare app AI agents
# The agents are used to suggest a dare and evaluate a dare

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from crewai import Agent, Task, Crew
from crewai_tools import ScrapeWebsiteTool, SerperDevTool
import warnings
warnings.filterwarnings('ignore')
import os
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import service_pb2_grpc
from clarifai_grpc.grpc.api import service_pb2, resources_pb2
from clarifai_grpc.grpc.api.status import status_code_pb2
from flask import Flask, request, jsonify

load_dotenv()
clarifai_api_key = os.getenv('CLARIFAI_API_KEY')
clarifai_application_id = os.getenv('CLARIFAI_APPLICATION_ID')
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
        verbose=False,
        allow_delegation=False,
        tools =[scrape_tool, search_tool]
    )

   
    # TASKS    
    suggest = Task(
        description=(
            "Suggest a dare to the user. The agent should provide a dare that is fun and safe and the user can prove they did it by "
             " uploading one photo"
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
        verbose=False
    )

    # RUN
    result = dare_crew.kickoff()
    return result.raw


# This function creates and uses an AI agent to evaluate a dare (safe or not) & Provable by a single photo or not
# :param: dare_suggestion: The dare to be evaluated
# :return: The evaluation of the dare (True for safe or False for not safe)
def evaluate_dare(dare_suggestion):
        
    # Defining the Tools
    search_tool = SerperDevTool()
    scrape_tool = ScrapeWebsiteTool()

    # AGENTS
    evaluate_dare = Agent(
        role="Dare Evaluator Agent",
        goal="Evaluates the {dare} suggested by the person",
        backstory="Specializing understanding the harmful and legal implications of a dare by some person, this agent uses online"
        " resources and common sense to confirm the {dare} is safe and legal.",
        verbose=False,
        allow_delegation=False,
        tools =[scrape_tool, search_tool]
    )

    analyze_dare = Agent(
        role="Dare Analyzer Agent",
        goal="Evaluates the {dare} suggested by the person to see if it is provable by a single photo",
        backstory="Specializing understanding the context of proving a dare by some person, this agent uses online"
        " resources and common sense to confirm the {dare} is provable by A SINGLE photo (VIDEOS ARE NOT ALLOWED)",
        verbose=False,
        allow_delegation=False,
        tools =[scrape_tool, search_tool]
    )

    evaluate = Task(
        description=(
            "Evaluate the given {dare} to confirm it is safe and legal and can be provable by a SINGLE PHOTO."
             " The agent should return True if the dare is safe and legal and can be proven by a single photo, and False otherwise."
        ),
        expected_output=(
            "Respond by 'True' if the dare is safe and legal and can be proven by a single photo, and 'False' otherwise."
        ),
        agents=[evaluate_dare, analyze_dare],
        output_pydantic= {"dare": str, "is_approved": bool}
    )

    # Define the crew with agents and tasks
    dare_crew = Crew(
        agents=[evaluate_dare, analyze_dare],
        tasks=[evaluate],
        manager_llm=ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7),
        verbose=False
    )

    dare = {'dare': dare_suggestion}

    # RUN
    result = dare_crew.kickoff(inputs=dare)

    return result


# This function uses Clarifai API to interpret the image and get the closest concepts
# :param: image_url: The URL of the image to be interpreted
# :return: The primary concepts of the image
def interpret_video(image_url):
    
    stub = service_pb2_grpc.V2Stub(ClarifaiChannel.get_grpc_channel())
    metadata = (("authorization", f"Key {clarifai_api_key}"),)

    #image_url = "https://samples.clarifai.com/metro-north.jpg"

    request = service_pb2.PostModelOutputsRequest(
        # This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id="general-image-recognition",
        user_app_id=resources_pb2.UserAppIDSet(app_id=clarifai_application_id),
        inputs=[
            resources_pb2.Input(
                data=resources_pb2.Data(image=resources_pb2.Image(url=image_url))
            )
        ],
    )
    response = stub.PostModelOutputs(request, metadata=metadata)

    if response.status.code != status_code_pb2.SUCCESS:
        print(response)
        raise Exception(f"Request failed, status code: {response.status}")

    primary_concepts = []

    for concept in response.outputs[0].data.concepts:
        primary_concepts.append(concept.name)
    
    return primary_concepts


# This function creates and uses an AI agent to evaluate if a user completed a dare
# :param: image_path: The path to the image to be evaluated
# :param: dare_suggested: The dare
# :return: The evaluation of the dare (True or False)
def check_completion(image_url, dare_suggested):

    # Defining the Tools
    search_tool = SerperDevTool()
    scrape_tool = ScrapeWebsiteTool()

    # AGENTS
    check_dare = Agent(
        role="Dare Checking Agent",
        goal="Compares the {dare} suggested by the person to the {interpretation} to check if the dare is completed in the {interpretation}",
        backstory="Specializing understanding the context of proving a dare, this agent uses online"
        " resources and common sense to confirm the {dare} is indeed completed based on the actions and context in the {interpretation}",
        verbose=False,
        allow_delegation=False,
        tools =[scrape_tool, search_tool]
    )

    # TASKS
    check = Task(
        description=(
            "Compare the given {dare} to confirm it is completed or not, based on the {interpretation} user's action" 
        ),
        expected_output=(
            "Respond by ONLY 'Dare is completed!' or 'Dare is not completed!' and no other word or explanation"
        ),
        agent= check_dare
    )

    # Define the crew with agents and tasks
    dare_crew = Crew(
        agents=[check_dare],
        tasks=[check],
        manager_llm=ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7),
        verbose=False
    )

    # RUN
    image_dare = {'interpretation': interpret_video(image_url), 'dare': dare_suggested}
    result = dare_crew.kickoff(inputs=image_dare)    
    
    return result.raw