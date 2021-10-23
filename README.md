# WORLDCUP2019 🏏-webscraping

# ABOUT:
This is a web scraping project which extracts information of WorldCup 2019 from cricinfo and present it in various different formats : Excel sheet, pdf score cards, json


# PURPOSE:
 -The purpose of this project is to extract information of worldcup 2019 from cricinfo and present
 that in the form of excel and pdf scorecards<br>
 -The real purpose is to learn how to extract information and get experience with js<br>
 -Another good reason is to have fun by making this cool project
 
 # TECH STACK:
 -Javascript<br>
 -Node Modules:<br>
 -Minimist: Takes the input from command line<br>
 -Axios:For making http request from the browser<br>
 -JSDOM:Library which interacts with the assembled HTML like a browser<br>
 -EXCEL4NODE:For making excel files<br>
 -PDF-LIB:Used to make pdf score cards
 
 ## Command for installing the above npm modules:
   -> npm init -y<br>
   -> npm install minimist<br>
   -> npm install excel4node<br>
   -> npm install jsdom<br>
   -> npm install axios<br>
   -> npm install pdf-lib<br>
   
 # RESULTS: 
    
 ## Matches JSON file
       Extracted information from JSDOM:
       ![Screenshot (312)](https://user-images.githubusercontent.com/67057463/138547592-74671b52-6a0e-45f3-8c6b-47fab8df17a8.png)

 ## Teams JSON file
       Categorize in the form of teams:
       ![Screenshot (313)](https://user-images.githubusercontent.com/67057463/138547603-21c41156-04a1-4361-b553-efeb7de35c00.png)

 ## Excel File
        ![Screenshot (314)](https://user-images.githubusercontent.com/67057463/138547626-b7d4c6aa-d5ec-4629-9085-df381dcf5674.png)

 
 ## Pdf Empty template:
        ![Screenshot (316)](https://user-images.githubusercontent.com/67057463/138547636-9b4949ec-b943-4f0b-8c4d-176ce686125c.png)

 ## Pdf-Score cards after execution:
        ![Screenshot (315)](https://user-images.githubusercontent.com/67057463/138547640-a1dd1ced-ec9c-47ec-9f82-a668c5cdd35d.png)
