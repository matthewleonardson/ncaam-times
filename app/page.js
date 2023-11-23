"use client"

import React from "react";
import Timer from "./timer";

export default function Home() {
  
  // minute_ms defines how often the website refetches data
  const MINUTE_MS = 60000;
  const SECOND_MS = 1000;
  const ENDPOINT_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&limit=200";
  const [jsonData, setJsonData] = React.useState(null);
  const [secsRemaining, setSecsRemaining] = React.useState(60);

  async function getJsonFromApi() {
    try {
      let response = await fetch(ENDPOINT_URL);
      let responseJson = await response.json();
      filterAndSortJson(responseJson)
     } catch(error) {
      console.error(error);
    }
  }

  function filterAndSortJson(data) {
    
    let to_append = ""

    for(let i = 0; i < data['events'].length; i++) {
      let event = data['events'][i];
      
      if(event['status']['type']['id'] === "2") {
        to_append += event['competitions'][0]['competitors'][1]['score'] + " - " + event['competitions'][0]['competitors'][0]['score'] + " " + event['name'] + " " + event['status']['type']['shortDetail'] +  '\n'
      }

    }

    if(to_append === "") {
      setJsonData("Nothing on!")
    } else {
      console.log()
      setJsonData(to_append)
    }
  }

  React.useEffect(() => {
    console.log("Fetched JSON on mount")
    getJsonFromApi()
  }, [])

  React.useEffect(() => {
    
    const interval = setInterval(() => {
      
        setSecsRemaining(60);
        console.log("Fetched JSON on timer")
        getJsonFromApi()
      
    }, MINUTE_MS);

    
  }, [])

  React.useEffect(() => {
    
    const id = setInterval(() => setSecsRemaining((oldSecsRemaining) => oldSecsRemaining - 1), SECOND_MS);

    return () => {
      clearInterval(id);
    };

  }, []);

  return (
    <>

    

    <div id="games">

      <Timer 
        time = {secsRemaining}
      />

      <pre>
        {(jsonData)}
      </pre>
   
   </div>
  </>
  )
}
