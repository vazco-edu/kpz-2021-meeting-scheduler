# kpz-2021-meeting-scheduler

## Before you start working:
Please enter the following commands to set up the virtual environment

**Django setup**
```sh
#Inside KPZ-2021-MEETING-SCHEDULER directory:

#Create virtual environment
python -m venv venv

#Activate created venv
source venv/bin/activate

#Install packages with pip package manager
pip install -r requirements.txt

#Export secret key, the example below is used only for development phase and should not be used in production
export SECRET=key

#Change directory and run django app
cd meeting_scheduler && python manage.py runserver

#If you work with fish, then replace first command with
#cd source venv/bin/activate.fish
```

**React setup**
```sh
#Inside KPZ-2021-MEETING-SCHEDULER directory:

#Change to React project directory
cd react_meeting_scheduler

#Create local variable in .env file, copy Google API Key from Google console  
echo REACT_APP_GOOGLE_KEY=your_google_api_key > .env

npm start
```


