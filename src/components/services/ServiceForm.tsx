import css from '../project/ProjectForm.module.css'
import { useState } from 'react'
import { Form, Input, Button, InputNumber, DatePicker, DatePickerProps } from 'antd'
import { Service } from '../interfaces/Service'
import { Project } from '../interfaces/Project'

interface servFormProps {
    handleSubmitService: Function,
    btnText?: string,
    projectData?
}

function ServiceForm({ handleSubmitService, btnText, projectData }: servFormProps) {

    const [services, setServices] = useState<Service>({} || projectData)

    function handleFinish(dataSubmit) {
        const service: Service = {
            id: 0,
            name: dataSubmit.name,
            cost: dataSubmit.cost,
            description: dataSubmit.description,
            initServiceDate: dataSubmit.initServiceDate,
            limitServiceDate: dataSubmit.limitServiceDate
        }
        handleSubmitService(service, projectData)
    }

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    return (<>
        <Form
            layout='vertical'
            onFinish={handleFinish}>
            <Form.Item
                name={['name']}
                rules={[{ required: true, message: 'Digite o nome do Serviço por favor!' }]}
                label="nome do Serviço">
                <Input placeholder='Ex. Atualizar banco de dados da NETFLIX' value={services.name} />
            </Form.Item>


            <Form.Item
                name={['limitServiceDate']}
                rules={[{ required: true, message: 'Especifique a data limite do serviço!' }]}
                label="Data do serviço">
                <DatePicker onChange={onChange} />
            </Form.Item>

            <Form.Item
                name={['cost']}
                rules={[{ required: true, type: 'number', min: 0, max: 5000 }]}
                label="custo do serviço">
                <InputNumber placeholder=' Ex. 100' value={services.cost} />
            </Form.Item>

            <Form.Item
                name={['description']}
                rules={[{ required: true }]}
                label="descrição do serviço">
                <Input placeholder=' Ex. 100' value={services.cost} />
            </Form.Item>

            <Button htmlType='submit'>
                {btnText}
            </Button>
        </Form>
    </>)
}

export default ServiceForm