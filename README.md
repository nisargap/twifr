# Twifr
### Utilizing the Twitter API with Facial Recognition

## What is Twifr?

Twifr allows a user to snap a picture and be redirected to the Twitter profile of the subject of the picture (as long as that person has tweeted about Twifr). 

## How does it work?

Twifr utilizes a real-time python script that on the event a person tweets about Twifr their profile picture is sent to a Kairos API image gallery. Now whenever that person uses Twifr to take a picture of themselves the Kairos API checks their image against the gallery and returns the most similar match.

## Design Considerations

- Speed (facial recognition should be fast)
- Accuracy

## Dependencies

- NodeJS 
- express, imgur-node-api, request, ejs, express-session
- Python

## To-do list

- Possibly incorporate a job candidate recognizer i.e. as candidates walk by at a job fair their face is recognized in real time and their resumes are brought up.
