import Breadcrumb from '@/components/component/breadcrumb';
import ButtonSubmit from '@/components/formik/button-submit';
import TextAreaField from '@/components/formik/text-area-field';
import TextField from '@/components/formik/text-field';
import { Api } from '@/lib/api';
import { CreateRetail } from '@/types/retail';
import PageWithLayoutType from '@/types/layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FieldArray, Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import notif from "@/utils/notif";
import MainAdmin from '@/components/layout/main-admin';
import { useEffect, useState } from 'react';
import DropdownField from '@/components/formik/dropdown-field';
import { CustomerView, PageCustomer } from '@/types/customer';
import { PageProduct, ProductView } from '@/types/product';
import TextFieldNumber from '@/components/formik/text-field-number';


type Props = object

const schema = Yup.object().shape({
  isNewCustomer: Yup.boolean().required(),
  customerId: Yup.string().when('isNewCustomer', {
    is: false,
    then: schema => schema.required('Customer is required'),
    otherwise: schema => schema.notRequired(),
  }),
  customerName: Yup.string().when('isNewCustomer', {
    is: true,
    then: schema => schema.required('New customer name is required'),
    otherwise: schema => schema.notRequired(),
  }),
  customerPhoneNumber: Yup.string().when('isNewCustomer', {
    is: true,
    then: schema => schema.required('New customer phone is required'),
    otherwise: schema => schema.notRequired(),
  }),
  notes: Yup.string(),
  products: Yup.array()
    .of(
      Yup.object().shape({
        productId: Yup.string().required('Product is required'),
        unitPrice: Yup.number()
          .typeError('Unit price must be a number')
          .required('Unit price is required')
          .moreThan(0, 'Unit price must be greater than 0'),
      })
    )
    .min(1, 'At least one product is required')
    .required('Products are required'),
});

const initFormikValue: CreateRetail = {
  isNewCustomer: false,
  customerId: '',
  customerName: '',
  customerPhoneNumber: '',
  totalAmount: '',
  notes: '',
  products: [
    {
      productId: '',
      unitPrice: '',
    }
  ]
}

const pageRequestCustomer: PageCustomer = {
  limit: -1,
}

const pageRequestProduct: PageProduct = {
  limit: -1,
}


const New: NextPage<Props> = () => {

  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerView[]>([]);
  const [products, setProducts] = useState<ProductView[]>([]);

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['retail', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/retail', val),
  });

  const { isLoading: isLoadingCustomer, data: dataCustomer } = useQuery({
    queryKey: ['customer', pageRequestCustomer],
    queryFn: ({ queryKey }) => Api.get('/customer', queryKey[1] as object),
  });

  const { isLoading: isLoadingProduct, data: dataProduct } = useQuery({
    queryKey: ['product', pageRequestProduct],
    queryFn: ({ queryKey }) => Api.get('/product', queryKey[1] as object),
  });


  useEffect(() => {
    if (dataCustomer?.status) {
      setCustomers(dataCustomer.payload.list);
    }
  }, [dataCustomer]);

  useEffect(() => {
    if (dataProduct?.status) {
      setProducts(dataProduct.payload.list);
    }
  }, [dataProduct]);



  const handleChangeCustomerType = (setFieldValue, val: boolean) => {
    setFieldValue('isNewCustomer', val);
    setFieldValue('customerId', '');
    setFieldValue('customerName', '');
    setFieldValue('customerPhoneNumber', '');
  }

  const handleSubmit = async (values: CreateRetail, formikHelpers: FormikHelpers<CreateRetail>) => {
    values.totalAmount = parseFloat(values.totalAmount as string) || 0
    values.products = values.products.map(product => ({
      ...product,
      unitPrice: parseFloat(product.unitPrice as string) || 0
    }));

    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/admin/retail')
        } else if (payload?.listError) {
          formikHelpers.setErrors(payload.listError);
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      }
    });
  }

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - New Retail'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Retail', path: '/admin/retail' },
            { name: 'Buat', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>New Retail</div>
          </div>
          <div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values, errors, setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4 max-w-xl ">
                      <div className="flex items-center">
                        <label className="flex items-center mr-4">
                          <input type="radio" className="h-4 w-4 mr-2 accent-current" name="custamerType" value={"old"} onChange={() => handleChangeCustomerType(setFieldValue, false)} checked={!values.isNewCustomer} />
                          <span>Saved Customer</span>
                        </label>
                        <label className="flex items-center mr-4">
                          <input type="radio" className="h-4 w-4 mr-2 accent-current" name="custamerType" value={"new"} onChange={() => handleChangeCustomerType(setFieldValue, true)} checked={values.isNewCustomer} />
                          <span>New Customer</span>
                        </label>
                      </div>
                    </div>
                    {values.isNewCustomer ? (
                      <>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'Customer Name'}
                            name={'customerName'}
                            type={'text'}
                            placeholder={'Customer Name'}
                            required
                          />
                        </div>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'Customer Nomor Telepon'}
                            name={'customerPhoneNumber'}
                            type={'text'}
                            placeholder={'628...'}
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <div className="mb-4 max-w-xl">
                        <DropdownField
                          label={"Customer"}
                          name={"customerId"}
                          items={customers}
                          keyValue={"id"}
                          keyLabel={"name"}
                          isLoading={isLoadingCustomer}
                          placeholder="Pilih Customer"
                          placeholderValue={""}
                          field={true}
                          required
                        />
                      </div>
                    )}
                    <div className="mb-4 max-w-xl">
                      <TextAreaField
                        label={'Catatan'}
                        name={'notes'}
                        placeholder={'Catatan'}
                      />
                    </div>
                    <FieldArray
                      name={'products'}
                      render={() => (
                        <div className="mb-12">
                          <div className='mb-4'>
                            <div className='text-xl'>Product</div>
                          </div>
                          {values.products.map((item, key) => {
                            return (
                              <div key={key}>
                                <div className="mb-4 max-w-xl">
                                  <DropdownField
                                    label={"Product"}
                                    name={`products.${key}.productId`}
                                    items={products}
                                    keyValue={"id"}
                                    keyLabel={"name"}
                                    isLoading={isLoadingProduct}
                                    placeholder="Pilih Product"
                                    placeholderValue={""}
                                    field={true}
                                    required
                                  />
                                </div>
                                <div className="mb-4 max-w-xl">
                                  <TextFieldNumber
                                    label={'Harga Per Ton'}
                                    name={`products.${key}.unitPrice`}
                                    placeholder={'1...'}
                                    required
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    />
                    <div className="mb-8 max-w-xl">
                      <ButtonSubmit
                        label={'Simpan'}
                        disabled={isPending}
                        loading={isPending}
                      />
                    </div>
                    {process.env.DEBUG === 'true' && (
                      <>
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(values, null, 4)}
                        </div>
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(errors, null, 4)}
                        </div>
                      </>
                    )}
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

(New as PageWithLayoutType).layout = MainAdmin;

export default New;