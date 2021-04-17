import * as React from 'react';
import {Button, Image, View, Platform} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class MyModel extends React.Component {
    constructor(){
        super();
        this.state = {
            image: null
        }
    }

    getPermissionAsync=async()=>{
        // getting permissions
        if(Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            // displaying alert when permission not granted
            if (status !== "granted"){
                alert("Sorry, permission required to access camera :(")
            } 
        }
    }

    // calling the function
    componentDidMount(){
        this.getPermissionAsync();
    }

    _pickImage=async()=>{
        // allowing to open gallery and choose image
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1
            })
            // uploading image details if not cancelled
            if (!result.cancelled){
                this.setState({image: result.data});
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
        // catching exceptions
        catch(E){
            console.log(E)
        }
    }

    uploadImage=async(uri)=>{
        const data = new FormData()
        let fileName = uri.split("/")[uri.split('/').length-1]

        // confirming filename
        console.log("Image: " + fileName)
        
        // beautifying the image name
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = {
            uri: uri,
            name: fileName,
            type: type
        }

        // adding image to array 
        data.append("alphabet",fileToUpload)

        // posting to server
        fetch("http://b8ec77b6988e.ngrok.io/predict-alphabet" , {
            method: "POST",
            body: data,
            headers: {
               "content-type": "multipart/form-data"
            }
        })
        // showing the status
        .then((response)=>response.json())
        .then((result)=>{
            console.log("Success!" , result)
        })
        .catch((error)=>{
            console.log("error :(", error)
        })
    }

    // showing button to pick image and rendering items
    render(){
        let {image} = this.state
        return(
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <Button
                title="Choose Image to predict"
                onPress={this._pickImage}/>
            </View>
        )
    }
}