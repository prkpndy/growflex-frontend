import { useNavigate } from "react-router-dom";
import { PasswordInput, TextInput, Button, Group, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

import "@mantine/dates/styles.css";

import ForgotPassword from "../../components/ForgotPassword";
import axiosInstance from "../../api/axios";

import "./index.css";

function RegistrationPage() {
  const navigate = useNavigate();
  const [visible, { toggle }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        )
          ? null
          : "Invalid password",
    },
  });

  return (
    <Box maw="40%" mx="auto">
      <h1 className="form-heading">Login</h1>
      <form
        onSubmit={form.onSubmit((values) => {
          axiosInstance
            .post("/api/users/login", {
              email: values.email,
              password: values.password,
            })
            .then((response) => {
              console.log(response);
              localStorage.setItem("authenticated", true);
              localStorage.setItem("email", values.email);
              localStorage.setItem("password", values.password);
              navigate("/dashboard");
            })
            .catch((error) => {
              console.log(error);
              alert("Incorrect email or password");
            });
        })}
      >
        <div className="form-element">
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />
        </div>

        <div className="form-element">
          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="password"
            visible={visible}
            onVisibilityChange={toggle}
            {...form.getInputProps("password")}
          />
        </div>

        <Group justify="flex-end" mt="md">
          <Button type="submit" variant="filled">
            Login
          </Button>
        </Group>
      </form>

      <div className="form-element">
        <ForgotPassword />
      </div>
    </Box>
  );
}

export default RegistrationPage;
