# @Author: Bertan Berker
# @Language: Python
# This is the test file for testing the backend functions

import requests

BASE_URL = 'http://localhost:3000'

def test_login(email, password):
    # Make a POST request with data
    data = {'email': email, 'password': password}
    response = requests.post(f'{BASE_URL}/login', json=data)
    print('Login Response:', response.json())


def test_register(email, password):
    # Make a POST request with data
    data = {'email': email, 'password': password}
    response = requests.post(f'{BASE_URL}/register', json=data)
    print('Register Response:', response.json())


def test_post_dare(email, dare):
    # Make a POST request with data
    data = {'email': email, 'dare': dare}
    response = requests.post(f'{BASE_URL}/postDare', json=data)
    print('Post Dare Response:', response.json())


def test_get_proposed_dares():
    response = requests.get(f'{BASE_URL}/getProposedDares')
    print('Get Proposed Dares Response:', response.json())


def get_dare_suggestion():
    response = requests.get(f'{BASE_URL}/getDareSuggestion')
    print('Get Dare Suggestion Response:', response.json())


def test_accepting_dare(email, dare):
    # Make a POST request with data
    data = {'email': email, 'dare': dare}
    response = requests.post(f'{BASE_URL}/acceptDare', json=data)
    print('Accept Dare Response:', response.json())

def test_get_accepted_dares(email):
    response = requests.get(f'{BASE_URL}/getAcceptedDares', params={'email': email})
    print('Get Accepted Dares Response:', response.json())


def test_upload_proof(email, dare, image_url):
    # Make a POST request with data
    data = {'email': email, 'dare': dare, 'image_url': image_url}
    response = requests.post(f'{BASE_URL}/uploadProof', json=data)
    print('Upload Proof Response:', response.json())


def test_get_score(email):
    response = requests.get(f'{BASE_URL}/getScore', params={'email': email})
    print('Get Score Response:', response.json())


def test_get_topScores():
    response = requests.get(f'{BASE_URL}/topScores')
    print('Get Top Scores Response:', response.json())

# SUCCESSFUL TESTS
#test_register('testUser1', '1111')
#test_login('testUser1', '1111')
# test_get_proposed_dares()
# get_dare_suggestion()
# test_get_topScores()
# test_get_score('testUser')
# test_accepting_dare('testUser', 'I dare you to eat an onion while running really fast')
# test_get_accepted_dares('testUser')


# CURRENTLY TESTING

#test_post_dare('testUser', 'I dare you to eat twenty onions while running really fast')

test_upload_proof('testUser', 'I dare you to eat an onion while running really fast', 'http://example.com/proof.jpg')

