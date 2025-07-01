import Breadcrumb from '@/components/component/breadcrumb';
import ButtonSubmit from '@/components/formik/button-submit';
import TextAreaField from '@/components/formik/text-area-field';
import { Api } from '@/lib/api';
import { CreateStockin } from '@/types/stockin';
import PageWithLayoutType from '@/types/layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import notif from "@/utils/notif";
import MainOperator from '@/components/layout/main-operator';
import DropdownField from '@/components/formik/dropdown-field';
import { PageProduct, ProductView } from '@/types/product';
import { useState, useEffect } from 'react';
import TextFieldNumber from '@/components/formik/text-field-number';


type Props = object

const schema = Yup.object().shape({
  productId: Yup.string().required('Required field'),
  remark: Yup.string(),
  netQuantity: Yup.number()
    .typeError('Field be a number')
    .required('Required field')
    .moreThan(0, 'Must be greater than 0'),
});

const initFormikValue: CreateStockin = {
  warehouseId: '',
  productId: '',
  remark: '',
  netQuantity: '',
}

const pageRequestProduct: PageProduct = {
  limit: -1,
}

const New: NextPage<Props> = () => {

  const router = useRouter();
  const [products, setProducts] = useState<ProductView[]>([]);


  const { data: loginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['stockin', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/stockin', val),
  });

  const { isLoading: isLoadingProduct, data: dataProduct } = useQuery({
    queryKey: ['product', pageRequestProduct],
    queryFn: ({ queryKey }) => Api.get('/product', queryKey[1] as object),
  });



  useEffect(() => {
    if (dataProduct?.status) {
      setProducts(dataProduct.payload.list);
    }
  }, [dataProduct]);

  const handleSubmit = async (values: CreateStockin, formikHelpers: FormikHelpers<CreateStockin>) => {
    values.warehouseId = loginUser.payload.user.warehouseId
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/stockin')
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
        <title>{process.env.APP_NAME + ' - New Stockin'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Stockin', path: '/stockin' },
            { name: 'New', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>New Stockin</div>
          </div>
          <div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4 max-w-xl">
                      <DropdownField
                        label={"Product"}
                        name={"productId"}
                        items={products}
                        keyValue={"id"}
                        keyLabel={"name"}
                        isLoading={isLoadingProduct}
                        placeholder="Select Product"
                        placeholderValue={""}
                        field={true}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextFieldNumber
                        label={'Net Quantity'}
                        name={`netQuantity`}
                        placeholder={'Net Quantity'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextAreaField
                        label={'Remark'}
                        name={'remark'}
                        placeholder={'Remark'}
                      />
                    </div>
                    <div className="mb-8 max-w-xl">
                      <ButtonSubmit
                        label={'Save'}
                        disabled={isPending}
                        loading={isPending}
                      />
                    </div>
                    {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(values, null, 4)}
                    </div> */}
                    {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(errors, null, 4)}
                    </div> */}
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

(New as PageWithLayoutType).layout = MainOperator;

export default New;