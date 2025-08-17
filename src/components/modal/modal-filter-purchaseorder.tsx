import Modal from "@/components/modal/modal";
import { PagePurchaseorder } from "@/types/purchaseorder";
import { NextPage } from "next/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import TextField from "@/components/formik/text-field";
import DateField from "@/components/formik/date-field";
import { Api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { CustomerView, PageCustomer } from "@/types/customer";
import DropdownField from "../formik/dropdown-field";
import TextFieldNumber from "../formik/text-field-number";


type Props = {
  show: boolean;
  onClickOverlay: () => void;
  filter: PagePurchaseorder
  setFilter: Dispatch<SetStateAction<PagePurchaseorder>>
}

const pageRequestCustomer: PageCustomer = {
  limit: -1,
}

const schema = Yup.object().shape({
});

const ModalFilterPurchaseorder: NextPage<Props> = ({ show, onClickOverlay, filter, setFilter }) => {

  const [initFormikValue, setInitFormikValue] = useState<PagePurchaseorder>(filter)
  const [customers, setCustomers] = useState<CustomerView[]>([]);

  const { isLoading: isLoadingCustomer, data: dataCustomer } = useQuery({
    queryKey: ['customer', pageRequestCustomer],
    queryFn: ({ queryKey }) => Api.get('/customer', queryKey[1] as object),
  });

  const handleSubmit = async (values: PagePurchaseorder) => {
    setFilter(values)
    onClickOverlay()
  }

  const handleClear = () => {
    setFilter({
      customerId: '',
      notes: '',
      createName: '',
      startTotalPrice: '',
      endTotalPrice: '',
      startTotalPayment: '',
      endTotalPayment: '',
      startOutstanding: '',
      endOutstanding: '',
      startCreateDt: '',
      endCreateDt: '',
    })
    onClickOverlay()
  }

  const handleClearStartCreateDt = (setFieldValue) => {
    setFieldValue('startCreateDt', '')
  }

  const handleClearEndCreateDt = (setFieldValue) => {
    setFieldValue('endCreateDt', '')
  }

  useEffect(() => {
    if (show) {
      setInitFormikValue(filter)
    }
  }, [show])

  useEffect(() => {
    if (dataCustomer?.status) {
      setCustomers(dataCustomer.payload.list);
    }
  }, [dataCustomer]);


  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Filter Purchase Order</div>
          <button type="button" onClick={() => onClickOverlay()} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4 border-gray-200" />
        <div>
          <div className="ml-auto">
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4">
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
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Catatan'}
                        name={'notes'}
                        type={'text'}
                        placeholder={'Catatan'}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <TextFieldNumber
                        label={'Total Price From'}
                        name={'startTotalPrice'}
                        placeholder={'1...'}
                      />
                      <TextFieldNumber
                        label={'Total Price To'}
                        name={'endTotalPrice'}
                        placeholder={'1...'}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <TextFieldNumber
                        label={'Total Payment From'}
                        name={'startTotalPayment'}
                        placeholder={'1...'}
                      />
                      <TextFieldNumber
                        label={'Total Payment To'}
                        name={'endTotalPayment'}
                        placeholder={'1...'}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <TextFieldNumber
                        label={'Outstanding From'}
                        name={'startOutstanding'}
                        placeholder={'1...'}
                      />
                      <TextFieldNumber
                        label={'Outstanding To'}
                        name={'endOutstanding'}
                        placeholder={'1...'}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <DateField
                        label={'Created From'}
                        name={'startCreateDt'}
                        type={'date'}
                        handleClear={() => handleClearStartCreateDt(setFieldValue)}
                      />
                      <DateField
                        label={'Created To'}
                        name={'endCreateDt'}
                        type={'date'}
                        handleClear={() => handleClearEndCreateDt(setFieldValue)}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <ButtonSubmit
                        label={'Clear Filter'}
                        type="reset"
                        onClick={() => handleClear()}
                        className={'duration-300 border-2 text-gray-600 border-gray-400 hover:bg-gray-100 hover:border-gray-500 focus:border-gray-500 h-10 rounded-md font-semibold px-4 w-full shadow-lg shadow-gray-500/20'}
                      />
                      <ButtonSubmit
                        label={'Filter'}
                      />
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalFilterPurchaseorder;