import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const handleClick = () =>setShow(!show);
  const history = useHistory();

  const toast = useToast()
  const [loading, setLoading] = useState(false);
  const postDetails=(pics) => {
      setLoading(true);
      if(pics === undefined){
         toast({
          title: 'Select Image',
          description: "Please select proper image format",
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      if(pics.type==="image/jpeg" || pics.type==="image/png"){
           const data = new FormData();
           data.append("file", pics);
           data.append ("upload_preset", "chat-app");
            data.append("cloud_name", "zinbo-chat-app");
            fetch("https://api.cloudinary.com/v1_1/image/upload", {
                method: 'post', 
                body: data,
            })
            .then((res) => res.json())
            .then(data=>{
                setPic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
      }else{
           toast({
          title: 'Select Image',
          description: "Please select proper image format",
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
        return; 
      }
  };


  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please fill in all the required fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords didn't match. Try again",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registerd Successfuly",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "An unexpected error Occured.",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px" color="black"  >
            <FormControl id='first-name' isRequired>
              <FormLabel>Name</FormLabel>
               <Input placeholder="Enter your name" _placeholder={{ color: 'pink.100' }} onChange={(e)=>setName(e.target.value)}/>
            </FormControl>

                <FormControl id='email' isRequired>
              <FormLabel>Email</FormLabel>
               <Input placeholder="Enter your Email" _placeholder={{ color: 'pink.100' }} onChange={(e)=>setEmail(e.target.value)}/>
            </FormControl>

                <FormControl id='password' isRequired>
              <FormLabel>Password</FormLabel>
                  <InputGroup>
                     <Input type={ show ? "true":"password"}  placeholder="Enter Password" _placeholder={{ color: 'pink.100' }} onChange={(e)=>setPassword(e.target.value)}/>
                      <InputRightElement width="4.5rem"> 
                          <Button h="1.75rem" size="sm" onClick={handleClick}>
                              {show ? "Hide" : "Show"}
                          </Button>
                      </InputRightElement>
                  </InputGroup>

            </FormControl>

             <FormControl id='password' isRequired>
              <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                     <Input type={ show ? "true":"password"}  placeholder="Confirm  Password" _placeholder={{ color: 'pink.100' }} onChange={(e)=>setConfirmpassword(e.target.value)}/>
                      <InputRightElement width="4.5rem"> 
                          <Button h="1.75rem" size="sm" onClick={handleClick}>
                              {show ? "Hide" : "Show"}
                          </Button>
                      </InputRightElement>
                  </InputGroup>

            </FormControl>

             <FormControl id='pic'>
              <FormLabel>Upload photo</FormLabel>
               <Input type="file" p={1.5} accept="image/*" onChange={(e)=>postDetails(e.target.files[0])}/>
            </FormControl>


            <Button colorScheme='teal' width="100%" style={{ marginTop: 15 }} onClick={submitHandler} variant='outline' isLoading={loading}>
                Sign Up
              </Button>
        </VStack>
        
  );
};

export default Signup