import { Button, Divider, Form, Input, message, Alert, Upload, UploadFile, UploadProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import http_common from "../../../http_common.ts";
import { IRegister, IRegisterForm } from "./types.ts";
import { PlusOutlined } from "@ant-design/icons";
import { imageConverter } from "../../../interfaces/forms";
import { useImagePreview } from "../../../utils/hooks.ts";
import ImagePreviewModal from "../../ImagePreviewModal.tsx";

const RegisterPage = () => {

    const navigate = useNavigate();

    const { previewOpen, previewImage, previewTitle, handleCancel, handlePreview } = useImagePreview();

    const [file, setFile] = useState<UploadFile | null>();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const onFinish = async (values: IRegisterForm) => {
        const model: IRegister = {
            ...values,
            image: values.image?.thumbUrl
        };
        console.log("Register model", model);

        try {
            const user = await http_common.post("/api/register", model);
            console.log("User create new", user);
            navigate("/");
        }
        catch (ex) {
            setErrorMessage("Щось пішло не так");
            message.error('Помилка реєстрації!');
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFile }) => {
        console.log("file chnage",)
        const newFileList = newFile.slice(-1);
        setFile(newFileList[0]);
    };

    return (
        <>
            <Divider style={customDividerStyle}>Реєстрація</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <Form
                name="basic"
                style={{ maxWidth: 1000 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off" >
                <Form.Item
                    label="Ім'я"
                    name="name"
                    rules={[{ required: true, message: "Вкажіть ім'я!" }]} >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Прізвище"
                    name="lastName"
                    rules={[{ required: true, message: "Вкажіть прізвище!" }]} >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Телефон"
                    name="phone"
                    htmlFor="phone"
                    rules={[
                        { required: true, message: 'Це поле є обов\'язковим!' },
                        { min: 11, message: 'Телефон повинна містити мінімум 11 символи!' }
                    ]} >
                    <Input autoComplete="phone" id={"phone"} />
                </Form.Item>

                <Form.Item
                    label="Фото"
                    name="image"
                    getValueFromEvent={imageConverter} >
                    <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        listType="picture-card"
                        onChange={handleChange}
                        onPreview={handlePreview}
                        accept="image/*" >
                        {file ? null :
                            (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Обрати фото</div>
                                </div>)
                        }
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Електронна пошта"
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
                    label="Пароль"
                    htmlFor={"password"}
                    rules={[
                        { required: true, message: 'Вкажіть Ваш пароль!', },
                        { min: 6, message: 'Пароль має мати мінімум 6 символів!', },
                    ]}
                    hasFeedback >
                    <Input.Password id={"password"} />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Повторіть Пароль"
                    htmlFor={"confirm"}
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Будь-ласка підтвердіть пароль!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Пароль не співпадають!'));
                            },
                        }),
                    ]} >
                    <Input.Password id={"confirm"} />
                </Form.Item>

                <ImagePreviewModal open={previewOpen}
                    title={previewTitle}
                    image={previewImage}
                    onCancel={handleCancel} />

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Реєструватися
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default RegisterPage;