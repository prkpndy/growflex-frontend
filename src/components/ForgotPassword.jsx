import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Button, TextInput, Group, Modal, PasswordInput } from "@mantine/core";

import axiosInstance from "../api/axios";

import "./index.css";

export default function ForgotPassword() {
  const [opened, { open, close }] = useDisclosure(false);
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
    <>
      <Modal
        opened={opened}
        onClose={close}
        radius={"xl"}
        size="xl"
        overlayProps={{
          blur: 3,
        }}
        centered
        styles={{
          header: {
            backgroundColor: "white",
          },
          body: { backgroundColor: "white" },
          close: {
            color: "#47baef",
            background: "none",
          },
        }}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            axiosInstance
              .put("/api/users/changePassword", {
                email: values.email,
                password: values.password,
              })
              .then((response) => {
                console.log(response);
                close();
                alert("Password successfully changed");
              })
              .catch((error) => {
                console.log(error);
                close();
                alert("Email does not exist");
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
              label="New Password"
              placeholder="password"
              description="Min 8 characters, at least one uppercase and lowercase letter, one number and one special character"
              visible={visible}
              onVisibilityChange={toggle}
              {...form.getInputProps("password")}
            />
          </div>

          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>

      <div className="forgot-password" onClick={() => open()}>
        <a style={{ cursor: "pointer", color: "red" }}>Forgot Password?</a>
      </div>
    </>
  );
}
