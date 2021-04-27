import React from 'react';

class Form extends React.Component {


    async handleSubmit() {
        let startSearchDateTimeValue = (document.getElementById("startSearchDateTime") as HTMLInputElement).value
        let enSearchDateTimeValue = (document.getElementById("endSearchDateTime") as HTMLInputElement).value
        let request = {
            timeMin: startSearchDateTimeValue,
            timeMax: enSearchDateTimeValue
        };
        console.log(JSON.stringify(request))

        const response = await fetch('http://127.0.0.1:8000/api', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(request)
        })
        return response.json();

    }


    render() {
        return(
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="startSearchDateTime">Start search date: </label>
                        <input type="datetime-local" id="startSearchDateTime" name="startSearchDateTime"/>

                        <label htmlFor="endSearchDateTime">End search date: </label>
                        <input type="datetime-local" id="endSearchDateTime" name="endSearchDateTime"/>
                        <input type="submit" value="Send"/>
                    </form>
                </div>
        );
    }
}
export default Form;



