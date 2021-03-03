import React, { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import Form, { Rule } from 'antd/lib/form';
import InputNumber from 'antd/lib/input-number';
import 'antd/lib/input-number/style/index.css';
import 'antd/lib/form/style/index.css';
import { i18NService } from './i18n.service';

const MONTHLY_RENT_VALIDATION: Rule = {
  validator: (rule, value) => {
    console.log('VALIDATOR VALUE:::', value);
    const formMonthlyRent = typeof value === 'string'
      ? i18NService.unformat(value)
      : value;
    if (formMonthlyRent === 0) {
      return Promise.reject(Error('Missing required field'));
    }
    if (typeof formMonthlyRent !== 'number' || formMonthlyRent < 0 || Number.isNaN(Number(formMonthlyRent))) {
      return Promise.reject(Error('Please enter a valid monthly rent amount'));
    }
    return Promise.resolve();
  },
};

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setValue] = useState<number | string>(0)
  const [form] = useForm();


  const formatter = (value: number | string = 0) => {
    return i18NService.getFormattedPrice(parseFloat(String(value)), 2)
  }

  const parser = (value: string | undefined) => {
    return (
      typeof value === 'string'
      ? i18NService.unformat(value)
      : ''
    )
  }

  return (
    <div className="App">
      <Form
        form={form}
        validateTrigger='onBlur'
      >pac
        <Form.Item
          name='numberValue'
          label='What&apos;s your monthly rent?'
          data-testid='dk-form-monthly-rent'
          rules={[MONTHLY_RENT_VALIDATION]}
        >
          <div className='this-div-is-causing-error'>
            <InputNumber
              formatter={formatter}
              defaultValue={1000}
              parser={parser}
              style={{width: '300px'}}
              onChange={(value) => {
                setValue(value);
              }}
            />
          </div>
        </Form.Item>
      </Form>
      Value in form: {form.getFieldValue('numberValue')}
    </div>
  );
}

export default App;
