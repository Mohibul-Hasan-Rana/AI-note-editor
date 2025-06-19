## Installation
 1. Clone the repository from: ``` git clone https://github.com/Mohibul-Hasan-Rana/AI-note-editor.git```

 2. Navigate to the project directory: ```cd AI-note-editor```

 3. Install dependencies: ```composer install```

 4. Set up environment variables: ```cp .env.example .env```

 5. Generate an application key: ```php artisan key:generate```

 6. Update database information in env file. 

 7. Run migration file: ```php artisan migrate```

 8. Copy and paste your GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI and OPENAI_API_KEY code in your env file.

 9. Run those command ```composer dumpautoload``` and ```php artisan config:cache```

 ## Usage 

 1. Run this commands: ```php artisan serve``` , ```npm install``` and ```npm run dev```

 2. Paste this URL in browser: http://127.0.0.1:8000/ 

 3. In dashboard, There is New note button. User can create note.

 4. On edit page, auto saving implemented. Also there are button ```Summarize with AI``` and ```Generate Tags```

 5. When user click on Summarize with AI button, the summarize version of this text will appear in bottom of the button.

 6. Generate tags functionality implemented in raw PHP.

 7. When user click on this button, all the tags from these text will extract and save tags into database. 
