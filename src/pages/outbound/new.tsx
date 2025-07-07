import Breadcrumb from '@/components/component/breadcrumb';
import ButtonSubmit from '@/components/formik/button-submit';
import TextAreaField from '@/components/formik/text-area-field';
import TextField from '@/components/formik/text-field';
import { Api } from '@/lib/api';
import { CreateOutbound } from '@/types/outbound';
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
import { PageWarehouse, WarehouseView } from '@/types/warehouse';
import { PageVehicle, VehicleView } from '@/types/vehicle';
import { displayNumber } from '@/utils/formater';


type Props = object

const schema = Yup.object().shape({
  isNewVehiclerdriver: Yup.boolean(),
  toWarehouseId: Yup.string().required("Required Field"),
  productId: Yup.string().required("Required Field"),
  vehicleId: Yup.string().when('isNewVehiclerdriver', {
    is: false,
    then: schema => schema.required('Customer is required'),
    otherwise: schema => schema.notRequired(),
  }),
  plateNumber: Yup.string().when('isNewCustomer', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  vehicleName: Yup.string().when('isNewCustomer', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  driverName: Yup.string().when('isNewCustomer', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  phoneNumber: Yup.string().when('isNewCustomer', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  sentGrossQuantity: Yup.number(),
  sentTareQuantity: Yup.number(),
  sentNetQuantity: Yup.number(),
});

const initFormikValue: CreateOutbound = {
  isNewVehiclerdriver: false,
  plateNumber: '',
  vehicleName: '',
  nik: '',
  driverName: '',
  phoneNumber: '',
  fromWarehouseId: '',
  toWarehouseId: '',
  remark: '',
  productId: '',
  vehicleId: '',
  sentGrossQuantity: '',
  sentTareQuantity: '',
  sentNetQuantity: '',
}

const pageRequestProduct: PageProduct = {
  limit: -1,
}

const pageRequestWarehouse: PageWarehouse = {
  limit: -1,
}

const pageRequestVehicle: PageVehicle = {
  limit: -1,
}

const New: NextPage<Props> = () => {

  const router = useRouter();
  const [products, setProducts] = useState<ProductView[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseView[]>([]);
  const [vehicles, setVehicles] = useState<VehicleView[]>([]);


  const { data: loginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['outbound', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/outbound', val),
  });

  const { isLoading: isLoadingProduct, data: dataProduct } = useQuery({
    queryKey: ['product', pageRequestProduct],
    queryFn: ({ queryKey }) => Api.get('/product', queryKey[1] as object),
  });

  const { isLoading: isLoadingWarehouse, data: dataWarehouse } = useQuery({
    queryKey: ['warehouse', pageRequestWarehouse],
    queryFn: ({ queryKey }) => Api.get('/warehouse', queryKey[1] as object),
  });

  const { isLoading: isLoadingVehicle, data: dataVehicle } = useQuery({
    queryKey: ['vehicle', pageRequestVehicle],
    queryFn: ({ queryKey }) => Api.get('/vehicle', queryKey[1] as object),
  });


  useEffect(() => {
    if (dataProduct?.status) {
      setProducts(dataProduct.payload.list);
    }
  }, [dataProduct]);

  useEffect(() => {
    if (dataWarehouse?.status) {
      setWarehouses(dataWarehouse.payload.list);
    }
  }, [dataWarehouse]);

  useEffect(() => {
    if (dataVehicle?.status) {
      setVehicles(dataVehicle.payload.list);
    }
  }, [dataVehicle]);

  const handleChangeVehicleType = (setFieldValue, val: boolean) => {
    setFieldValue('isNewVehiclerdriver', val);
    setFieldValue('vehicleId', '');
    setFieldValue('plateNumber', '');
    setFieldValue('vehicleName', '');
    setFieldValue('driverName', '');
    setFieldValue('phoneNumber', '');
  }

  const handleSubmit = async (values: CreateOutbound, formikHelpers: FormikHelpers<CreateOutbound>) => {
    values.fromWarehouseId = loginUser.payload.user.warehouseId
    values.sentGrossQuantity = parseFloat(values.sentGrossQuantity as string) || 0
    values.sentTareQuantity = parseFloat(values.sentTareQuantity as string) || 0
    values.sentNetQuantity = values.sentGrossQuantity - values.sentTareQuantity
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/outbound')
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
        <title>{process.env.APP_NAME + ' - New Outbound'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Outbound', path: '/outbound' },
            { name: 'New', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>New Outbound</div>
          </div>
          <div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values, setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4 max-w-xl ">
                      <div className="flex items-center">
                        <label className="flex items-center mr-4">
                          <input type="radio" className="h-4 w-4 mr-2 accent-current" name="custamerType" value={"old"} onChange={() => handleChangeVehicleType(setFieldValue, false)} checked={!values.isNewVehiclerdriver} />
                          <span>Saved Vehicle</span>
                        </label>
                        <label className="flex items-center mr-4">
                          <input type="radio" className="h-4 w-4 mr-2 accent-current" name="custamerType" value={"new"} onChange={() => handleChangeVehicleType(setFieldValue, true)} checked={values.isNewVehiclerdriver} />
                          <span>New Vehicle</span>
                        </label>
                      </div>
                    </div>
                    {values.isNewVehiclerdriver ? (
                      <>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'Vehicle Name'}
                            name={'vehicleName'}
                            type={'text'}
                            placeholder={'Vehicle Name'}
                            required
                          />
                        </div>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'Plate Number'}
                            name={'plateNumber'}
                            type={'text'}
                            placeholder={'B 123...'}
                            className='uppercase'
                            required
                          />
                        </div>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'Driver Name'}
                            name={'driverName'}
                            type={'text'}
                            placeholder={'Driver Name'}
                            required
                          />
                        </div>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'Phone Number'}
                            name={'phoneNumber'}
                            type={'text'}
                            placeholder={'628...'}
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <div className="mb-4 max-w-xl">
                        <DropdownField
                          label={"Vehicle"}
                          name={"vehicleId"}
                          items={vehicles}
                          keyValue={"id"}
                          keyLabel={"plateNumber"}
                          isLoading={isLoadingVehicle}
                          placeholder="Select Vehicle"
                          placeholderValue={""}
                          field={true}
                          required
                        />
                      </div>
                    )}
                    <div className="mb-4 max-w-xl">
                      <DropdownField
                        label={"Destination Warehouse"}
                        name={"toWarehouseId"}
                        items={warehouses}
                        keyValue={"id"}
                        keyLabel={"name"}
                        isLoading={isLoadingWarehouse}
                        placeholder="Select Warehouse"
                        placeholderValue={""}
                        field={true}
                        required
                      />
                    </div>
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
                      <TextAreaField
                        label={'Remark'}
                        name={'remark'}
                        placeholder={'Remark'}
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextFieldNumber
                        label={'Tare Quantity'}
                        name={`sentTareQuantity`}
                        placeholder={'Tare Quantity'}
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextFieldNumber
                        label={'Gross Quantity'}
                        name={`sentGrossQuantity`}
                        placeholder={'Gross Quantity'}
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <div>Net Quantity</div>
                      <div>{displayNumber((parseFloat(values.sentGrossQuantity as string || "0") - parseFloat(values.sentTareQuantity as string || "0")))}</div>
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