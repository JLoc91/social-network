import { useState, useEffect } from "react";

export default function FindPeople() {
    // first - name of property in state
    // setFirst - function that we can call which changes the value of 'first' in state
    const [word, setWord] = useState("");
    const [people, setPeople] = useState([]);

    useEffect(() => {
        console.log("render starting user");
        fetch(`/findPeoples`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from findPeopleStart: ", data);
                setPeople(data);
            });
    }, [word == ""]);

    useEffect(() => {
        console.log("useEffect is running");
        // console.log(`${first} has been rendered in useEffect!`);
        console.log("word before fetch: ", word);
        fetch(`/findPeople/${word}`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from findPeople: ", data);
                setPeople(data);
            });
    }, [word]);

    // function handleInput(e) {
    //     // console.log("value in input field: ", e.target.value);
    //     setFirst(e.target.value);
    // }

    if (!word == "") {
        return (
            <div>
                <h2>Find People</h2>
                <input
                    key={1}
                    // onChange={handleInput}
                    onChange={(e) => setWord(e.target.value)}
                    defaultValue={word}
                    placeholder="Enter Name"
                />
                {/* <ul> */}
                {people.map((item) => (
                    <li key={item.id}>
                        <img
                            src={
                                item.url ||
                                "https:/s3.amazonaws.com/spicedling/-E2SRd1Y-R4G67_JbXqfpMtcmerzTutu.png"
                            }
                            alt={item.first}
                            className="findPeople"
                            // onClick={togglePopup}
                        ></img>
                        <h2>
                            {item.first} {item.last}
                        </h2>
                    </li>
                ))}
                {/* </ul> */}

                {/* <input
                placeholder="type country"
                onChange={(e) => setCountry(e.target.value)}
            /> */}
            </div>
        );
    } else {
        return (
            <div>
                <h2>Find People</h2>
                <h3>Checkout who just joined!</h3>

                {/* <ul> */}
                {people.map((item) => (
                    <li key={item.id}>
                        <img
                            src={
                                item.url ||
                                "https:/s3.amazonaws.com/spicedling/-E2SRd1Y-R4G67_JbXqfpMtcmerzTutu.png"
                            }
                            alt={item.first}
                            className="findPeople"
                            // onClick={togglePopup}
                        ></img>
                        <h2>
                            {item.first} {item.last}
                        </h2>
                    </li>
                ))}
                {/* </ul> */}
                <h3>Are you looking for someone in particular?</h3>
                <input
                    key={1}
                    // onChange={handleInput}
                    onChange={(e) => setWord(e.target.value)}
                    defaultValue={word}
                    placeholder="Enter Name"
                />
                {/* <input
                placeholder="type country"
                onChange={(e) => setCountry(e.target.value)}
            /> */}
            </div>
        );
    }

    // return (
    //     <div>
    //         <h2>Find People</h2>
    //         <h3>Checkout who just joined!</h3>

    //         {/* <ul> */}
    //         {people.map((item) => (
    //             <li key={item.id}>
    //                 <img
    //                     src={
    //                         item.url ||
    //                         "https:/s3.amazonaws.com/spicedling/-E2SRd1Y-R4G67_JbXqfpMtcmerzTutu.png"
    //                     }
    //                     alt={item.first}
    //                     className="findPeople"
    //                     // onClick={togglePopup}
    //                 ></img>
    //                 <h2>
    //                     {item.first} {item.last}
    //                 </h2>
    //             </li>
    //         ))}
    //         {/* </ul> */}
    //         <h3>Are you looking for someone in particular?</h3>
    //         <input
    //             // onChange={handleInput}
    //             onChange={(e) => setWord(e.target.value)}
    //             defaultValue={word}
    //             placeholder="Enter Name"
    //         />
    //         {/* <input
    //             placeholder="type country"
    //             onChange={(e) => setCountry(e.target.value)}
    //         /> */}
    //     </div>
    // );
}
