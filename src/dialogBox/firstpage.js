import React from "react";
import { useState, useEffect } from "react";
import "./firstpage.css";
import "./firstpage2.css";
import axios from "axios";

const Popup = ({ title, content, visible, onClose }) => {
    return visible && (
        <div className="popup-main" >
            <div className="popup" >
                <div className="popup-header" >
                    <h3> {title} </h3>
                    <span onClick={onClose} className="x" > {'X'} </span>
                </div>

                <div className="popup-content" >
                    {content || null}
                </div>
            </div>
        </div>
    )
}

const ShareContent = ({ link }) => {
    return (
        <div >
            {'Share this document at: '}
            {link}
            {/* <a href={link} > {link} </a> */}
        </div>
    )
}

const DOMAIN = 'https://texts-share.herokuapp.com';
const SHARE_URL = `${DOMAIN}/saveText`;
const GET_URL = `${DOMAIN}/getText`;

function Firstpage() {
    const [text, setText] = useState("");
    const [isDisabled, setDisabled] = useState(false);
    const [link, setLink] = useState("http://localhost:3000/abcdef");
    const [showPopup, setShowPopup] = useState(false);
    const [password, setPassword] = useState('');
    const [havePassword, setHavePassword] = useState(false);
    const [textPassword, setTextPassword] = useState(null);

    //DB-> backend works here
    useEffect(() => {
        var url = new URL(document.URL);
        var textId = url.searchParams.get("textId");

        if (textId) {
            axios.post(GET_URL, {
                textId,
                password: textPassword
            }).then(response => {
                if (response.data.success) {
                    const _text = response.data.text;
                    setText(_text);
                    setDisabled(true);
                } else {
                    if (response.data.passwordRequired) {
                        const password = prompt('Enter Password');
                        if (password) {
                            setTextPassword(password);
                        } else {
                            alert('Enter a valid password.');
                        }
                    } else {
                        if (response.data.error) {
                            alert(response.data.mssg);
                        }
                    }
                }
            }).catch(e => {
                console.log(e);
            })
        }
    }, [textPassword]);


    const handleSharing = () => {
        if (text && text.length > 0) {

            if (havePassword) {

                if (password.length < 4) {
                    alert('Password minimum 4 length.')
                    return;
                }

                //DB-> backend works here
                axios.post(SHARE_URL, {
                    text,
                    password
                }).then(response => {
                    if (response.data.success) {
                        const textId = response.data.textId;
                        setLink(`http://localhost:3000?textId=${textId}`);
                        setShowPopup(true);
                        setText('');
                    }
                }).catch(e => {
                    console.log(e);
                })
            } else {
                axios.post(SHARE_URL, {
                    text
                }).then(response => {
                    if (response.data.success) {
                        const textId = response.data.textId;
                        setLink(`http://localhost:3000?textId=${textId}`);
                        setShowPopup(true);
                        setText('');
                    }
                }).catch(e => {
                    console.log(e);
                })
            }
        } else {
            alert('Enter Some Text First')
            return;
        }
    }

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setHavePassword(isChecked);
        if (isChecked) {
            setPassword('');
        }
        //DB-> backend works here
        if (password && password.length > 0) {
            axios.post({
                password
            }).then(response => {
                if (response.data.success) {
                    const enteredPassword = response.data.enteredPassword;
                    setPassword(`${enteredPassword}`);
                    setHavePassword(true);
                    setPassword('');
                }
            }).catch(e => {
                console.log(e);
            })
        }
    }

    return (<>
        <div className="page" >
            <div className="Wrap" >

                <h2>
                    Write whatever you want to write!
                </h2>
{/* DB-> backend works here */}
                <textarea value={text}
                    disabled={isDisabled}
                    onChange={
                        (e) => setText(e.target.value)
                    }
                    placeholder="Write Here!"
                />
                {/* <label for="_checkbox" > */}
                    <div>
                        <input type="checkbox"
                            className="secure-text"
                            onChange={handleCheckboxChange}
                        />Secure Text</div>
                {/* </label> */}
            {/* DB-> backend works here */}
                {
                    havePassword &&
                    <input
                        value={password}
                        minLength={4}
                        onChange={
                            (e) => setPassword(e.target.value)
                        }
                        placeholder="Enter password here"
                        className="password" />
                }
                <button
                    className="Sharebutton"
                    onClick={handleSharing} >
                    Share
                </button>

            </div></div>

        < Popup 
            visible={showPopup}
            title={'Share & Save'}
            content={< ShareContent link={link}
            />}
            onClose={() => setShowPopup(false)} />
    </>
    )
}
export default Firstpage;
