import { Divider, message, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { IProductEdit } from "./types.ts";
import http_common from "../../../http_common.ts";
import { APP_ENV } from "../../../env/index.ts";
import ProductForm from "../ProductForm.tsx";
import { useForm } from "antd/es/form/Form";

const customDividerStyle = {
    borderTop: '2px solid #1890ff',
    margin: '5px 0 50px 0',
};

const ProductEditPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const urlServerImage = APP_ENV.BASE_URL + "/upload/150_";

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [form] = useForm();

    useEffect(() => {
        http_common.get(`/api/products/${id}`)
            .then(response => {
                console.log(response.data);

                const imageFileList = response.data?.product_images.map((image: any) => ({
                    uid: image.id,
                    name: image.name,
                    status: 'done',
                    url: urlServerImage + image.name
                }));

                console.log(imageFileList)
                setFileList(imageFileList);

                form.setFieldsValue(
                    {
                        name: response.data?.name,
                        category_id: response.data?.category_id,
                        description: response.data?.description,
                        price: response.data?.price,
                        quantity: response.data?.quantity
                    });

            });
    }, [id]);

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log('file:', fileList);

        if (fileList.length === 0) {
            setErrorMessage("Choose image!");
            return;
        }

        const model: IProductEdit = {
            category_id: values.category_id,
            name: values.name,
            description: values.description,
            price: values.price,
            quantity: values.quantity,
            images: fileList.map(file => file.originFileObj ? file.originFileObj : file.url) as File[]

        };
        console.log(model);

        try {
            await http_common.post(`/api/products/${id}`, model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            //Return to home page
            navigate("/products");
        }
        catch (ex) {
            message.error('Product creating error!');
        }
    }

    const handleImageFileListChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <>
            <Divider style={customDividerStyle}>Edit product</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <ProductForm form={form}
                submitButtonTitle="Edit"
                onFinish={onFinish}
                onChange={handleImageFileListChange}
                fileList={fileList} />
        </>
    );
}

export default ProductEditPage;