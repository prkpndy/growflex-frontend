import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  PasswordInput,
  TextInput,
  Button,
  Group,
  Box,
  Select,
  Radio,
  Checkbox,
  Stack,
  FileInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { getCountries, getStates } from "country-state-picker";

import "@mantine/dates/styles.css";

import axiosInstance from "../../api/axios";

import "./index.css";

function RegistrationPage() {
  const [countries, setCountries] = useState([]);
  const [countryToCode, setCountryToCode] = useState({});
  const [states, setStates] = useState([]);

  const [imageFileName, setImageFileName] = useState("");
  const [visible, { toggle }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      dob: "",
      country: "",
      state: "",
      city: "",
      zip: "",
      areaOfInterest: [],
      password: "",
      profilePictureName: "",
    },

    validate: {
      firstName: (value) =>
        /^[a-zA-Z]+$/.test(value) ? null : "Invalid first name",
      lastName: (value) =>
        /^[a-zA-Z]+$/.test(value) ? null : "Invalid last name",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      gender: (value) =>
        value.length > 2 ? null : "Please specify your gender",
      dob: (value) => (value ? null : "Please specify your DOB"),
      country: (value) => (value ? null : "Please specify your country"),
      state: (value) => (value ? null : "Please specify your state"),
      city: (value) =>
        value.length !== 0 && /^[A-Za-z\s]+$/.test(value)
          ? null
          : "Please specify a valid city",
      zip: (value) =>
        /^\d{6}$/.test(value) ? null : "Please specify a valid ZIP",
      areaOfInterest: (value) =>
        value.length > 0 ? null : "Please specify your interests",
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        )
          ? null
          : "Invalid password",
      profilePictureName: (value) =>
        value.length > 0 ? null : "Please upload a profile picture",
    },
  });

  useEffect(() => {
    const cwc = getCountries();
    const ctr = [];
    const c2code = {};

    cwc.forEach((c) => {
      c2code[c["name"]] = c["code"];
      ctr.push(c["name"]);
    });

    setCountries(ctr);
    setCountryToCode(c2code);
    console.log(ctr);
    console.log(c2code);
  }, []);

  const handleImageChange = (value) => {
    let formData = new FormData();
    formData.append("image", value, value.name);

    axiosInstance
      .post("/api/users/imageUpload", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        setImageFileName(response.data.name);
        form.setValues({ profilePictureName: response.data.name });
        alert("Image Uploaded");
      })
      .catch((error) => {
        console.log(error);
        alert("Image upload failed!");
      });
  };

  return (
    <Box maw="40%" mx="auto">
      <h1 className="form-heading">Register</h1>
      <form
        onSubmit={form.onSubmit((values) => {
          axiosInstance
            .post("/api/users/signup", {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              gender: values.gender,
              dob: values.dob,
              country: values.country,
              state: values.state,
              city: values.city,
              zip: values.zip,
              areaOfInterest: values.areaOfInterest,
              password: values.password,
              profilePictureFilePath: imageFileName,
            })
            .then((response) => {
              console.log(response);
              alert("Registration successful");
            })
            .catch((error) => {
              console.log(error);
              alert("Sorry, Registration failed!");
            });
        })}
      >
        <div className="form-element">
          <TextInput
            withAsterisk
            label="First Name"
            placeholder="first name"
            {...form.getInputProps("firstName")}
          />
        </div>

        <div className="form-element">
          <TextInput
            withAsterisk
            label="Last Name"
            placeholder="last name"
            {...form.getInputProps("lastName")}
          />
        </div>

        <div className="form-element">
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />
        </div>

        <div className="form-element">
          <Radio.Group
            withAsterisk
            label="Gender"
            name="gender"
            {...form.getInputProps("gender")}
          >
            <Stack mt="xs">
              <Radio value="male" label="Male" />
              <Radio value="female" label="Female" />
              <Radio value="notSpecified" label="Prefer not to say" />
            </Stack>
          </Radio.Group>
        </div>

        <div className="form-element">
          <DatePickerInput
            withAsterisk
            label="Date of Birth"
            placeholder="DOB"
            {...form.getInputProps("dob")}
          />
        </div>

        <div className="form-element">
          <Select
            withAsterisk
            label="Country"
            placeholder="Select"
            data={countries}
            searchable
            {...form.getInputProps("country")}
            onChange={(value) => {
              setStates(getStates(countryToCode[value]));
            }}
          />
        </div>

        <div className="form-element">
          <Select
            withAsterisk
            label="State"
            placeholder="Select"
            data={states}
            searchable
            {...form.getInputProps("state")}
          />
        </div>

        <div className="form-element">
          <TextInput
            withAsterisk
            label="City"
            placeholder="city"
            {...form.getInputProps("city")}
          />
        </div>

        <div className="form-element">
          <TextInput
            withAsterisk
            label="ZIP"
            placeholder="ZIP code"
            description="6 digit ZIP"
            {...form.getInputProps("zip")}
          />
        </div>

        <div className="form-element">
          <Checkbox.Group
            withAsterisk
            label="Areas of Interest"
            {...form.getInputProps("areaOfInterest")}
          >
            <Stack mt="xs">
              <Checkbox value="reading" label="Reading" />
              <Checkbox value="writing" label="Writing" />
              <Checkbox value="traveling" label="Traveling" />
              <Checkbox value="playing" label="Playing" />
            </Stack>
          </Checkbox.Group>
        </div>

        <div className="form-element">
          <FileInput
            label="Upload Profile Picture"
            description="Should be in .png, .jpg or .jpeg format "
            placeholder="Image"
            {...form.getInputProps("profilePictureName")}
            onChange={handleImageChange}
          />
        </div>

        <div className="form-element">
          <PasswordInput
            withAsterisk
            label="Password"
            description="Min 8 characters, at least one uppercase and lowercase letter, one number and one special character"
            visible={visible}
            placeholder="password"
            onVisibilityChange={toggle}
            {...form.getInputProps("password")}
          />
        </div>

        <Group justify="flex-end" mt="lg">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

export default RegistrationPage;
