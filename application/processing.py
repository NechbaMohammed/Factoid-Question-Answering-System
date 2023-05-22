import requests
from typing import List
import logging
import random
import wikipedia as wiki
import os

API_URL_ENG = os.getenv("RENDER_API_URL_ENG")
API_URL_AR = os.getenv("RENDER_API_URL_AR")
headers = {"Authorization": "Bearer " + os.getenv("RENDER_HUGGINGFACE_API_KEY")}

#API_URL_ENG = "https://api-inference.huggingface.co/models/distilbert-base-cased-distilled-squad"
#API_URL_AR = "https://api-inference.huggingface.co/models/ZeyadAhmed/AraElectra-Arabic-SQuADv2-QA"
#headers = {"Authorization": "Bearer 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"}

"""
This module contains one function, `get_articles`, which performs document retrieval:
https://en.wikipedia.org/wiki/Document_retrieval
In other words, this is a search engine.
"""

logging.basicConfig(level=logging.INFO)
logging.info("Running doc retrieval module")


def get_articles(query: str, num_articles_search: int, characters_per_article: int, language: str = 'english') -> List[tuple]:
    """
    This function takes a query and downloads the text of relevant Wikipedia articles.
    Parameters
    ----------
    query : str
        A query that will be used to identify relevant Wikipedia articles.
        Example: "Who did Joe Biden defeat in 2020?"
    num_articles_search : int
        The number of articles that will be searched and downloaded.
    characters_per_article : int
        The number of characters that will be included. The answer to a question
        is usually in the beginning of an article, so it's not necessary to search
        the entire article.
    language : str, optional
        The language of the Wikipedia articles. Defaults to 'english'.
    Returns
    -------
    list
        A list of tuples where an article's title is mapped to its text. Example:
        [("United States", "The United States is..."),
        ("Barack Obama", "Barack Obama is a politician..."), ...]
    """
    if language == "arabic":
        # set the language to Arabic
        wiki.set_lang("ar")
    else:
        wiki.set_lang("en")

    logging.debug("Retrieving documents")

    # A list of article titles - these may not be the "correct" titles (see below)
    article_titles = wiki.search(query, results=num_articles_search)

    # Collect tuples of (article_title, article_text)
    article_data = []
    for title in article_titles:
        try:
            # Try to get the text of the article.
            text = wiki.page(title).content[:characters_per_article]
        except (wiki.exceptions.PageError, wiki.exceptions.DisambiguationError) as e:
            # Skip the problematic titles and continue with the retrieval process
            logging.warning(f"Error occurred for title '{title}': {str(e)}")
            continue

        article_data.append((title, text))

    return dict(article_data)


def query(payload, language='english'):
    if language == 'english':
        response = requests.post(API_URL_ENG, headers=headers, json=payload)
    elif language == 'arabic':
        response = requests.post(API_URL_AR, headers=headers, json=payload)
    return response.json()


def get_answer(question, context, language='english'):
        result = query({
        "inputs": {
            "question": question,
            "context": context
        },}, language=language)
       
        return {"answer": result["answer"], "score": result["score"]}


def get_best_answer(query: str, num_articles_search: int, characters_per_article: int, language: str = 'english'):
    print("Retrieving top documents ...")
    docs = get_articles(query, num_articles_search, characters_per_article, language=language)

    answers = {}
    i = 1
    for doc in docs:
        print('Searching for answer in doc', i)
        question, context = query, docs[doc]
        result = get_answer(question, context, language=language)
        if result['answer'] in answers:
            answers[result['answer']] = max(answers[result['answer']], result['score'])
        else:
            answers[result['answer']] = result['score']
        i += 1

    answers_l = sorted(answers.items(), key=lambda x: x[1], reverse=True)
    
    return answers_l[0][0]
