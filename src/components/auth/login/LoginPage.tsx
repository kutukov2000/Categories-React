import { Button, Divider, Form, Input, message, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ILogin } from "./types.ts";
import http_common from "../../../http_common.ts";

const LoginPage = () => {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const onFinish = async (model: ILogin) => {

        console.log("Login model", model);

        try {
            const user = await http_common.post("/api/login", model);
            console.log("Login response: ", user);
            navigate("/");
        }
        catch (ex) {
            setErrorMessage("Щось пішло не так");
            message.error('Authorization error!');
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };

    return (
        <>
            <Divider style={customDividerStyle}>Login</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <Form
                name="login"
                style={{ maxWidth: 1000 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off" >
                <Form.Item
                    label="Email"
                    name="email"
                    htmlFor="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'Формати пошти не правильний!',
                        },
                        { required: true, message: 'Це поле є обов\'язковим!' },
                        { min: 2, message: 'Пошта повинна містити мінімум 2 символи!' }
                    ]} >
                    <Input autoComplete="email" id={"email"} />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    htmlFor={"password"}
                    rules={[
                        { required: true, message: 'Вкажіть Ваш пароль!', },
                        { min: 6, message: 'Пароль має мати мінімум 6 символів!', },
                    ]}
                    hasFeedback >
                    <Input.Password id={"password"} />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default LoginPage;