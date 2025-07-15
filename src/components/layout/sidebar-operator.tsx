import React, { useEffect, useState } from 'react';
import { BiAbacus } from 'react-icons/bi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BsList } from 'react-icons/bs';
import { AiOutlineProduct } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { UserprivilegeView } from '@/types/userprivilage';


interface Props {
  sidebar: boolean,
  onClickOverlay: (boolean?) => void,
  userprivilege: UserprivilegeView
}

const icons = {
  BiAbacus,
  AiOutlineProduct,
  FaRegCalendarAlt,
};

const defaultMenu = [
  {
    name: 'Dashboard',
    icon: 'BiAbacus',
    path: '/dashboard',
  },
  {
    name: 'Stockin',
    icon: 'FaRegCalendarAlt',
    path: '/stockin',
  },
  {
    name: 'Transfer Out',
    icon: 'AiOutlineProduct',
    path: '/outbound',
  },
  {
    name: 'Transfer In',
    icon: 'AiOutlineProduct',
    path: '/inbound',
  },
  {
    name: 'Purchase Order',
    icon: 'AiOutlineProduct',
    path: '/purchaseorder',
  },
  {
    name: 'Retail',
    icon: 'AiOutlineProduct',
    path: '/retail',
  },
];

const mapingMenu = (defaultMenu, userprivilege: UserprivilegeView) => {
  const mapmenu = []
  if (userprivilege) {
    defaultMenu.map((menu) => {
    switch (menu.name) {
      case 'Dashboard':
          mapmenu.push(menu)
        break;
      case 'Stockin':
          if (userprivilege.stockIn) mapmenu.push(menu)
        break;
      case 'Transfer Out':
          if (userprivilege.transferOut) mapmenu.push(menu)
        break;
      case 'Transfer In':
          if (userprivilege.transferIn) mapmenu.push(menu)
        break;
      case 'Purchase Order':
          if (userprivilege.purchaseOrder) mapmenu.push(menu)
        break;
      case 'Retail':
          if (userprivilege.retail) mapmenu.push(menu)
        break;
      default:
        break;
    }
  }) 
  }
  

  return mapmenu
}

const SidebarOperator: React.FC<Props> = ({ sidebar, onClickOverlay, userprivilege }) => {

  const router = useRouter();

  const [menu, setMenu] = useState(mapingMenu(defaultMenu, userprivilege))

  useEffect(() => {
    onClickOverlay(false);
  }, [router.pathname]);

  useEffect(() => {
    setMenu(mapingMenu(defaultMenu, userprivilege))
  }, [userprivilege])

  const Menu = ({ name, icon, path }) => {
    const isSelected = path.replace('/', '') === router.pathname.split('/')[1];


    const Icon = (props) => {
      const { icon } = props;
      const TheIcon = icons[icon];

      return <TheIcon {...props} />;
    };

    return (
      <Link href={path}>
        <div className={isSelected ? 'flex items-center px-4 h-12 bg-primary-200 duration-300 ease-in-out ' : 'flex items-center px-4 h-12 hover:bg-primary-100 duration-300 ease-in-out '}>
          <Icon icon={icon} className={`mr-2 ${isSelected ? 'text-gray-700' : 'text-gray-600'}`} size={'1.2rem'} />
          <div className={` ${isSelected ? 'text-gray-700' : 'text-gray-600'}`}>{name}</div>
        </div>
      </Link>
    );
  };


  return (
    <nav>
      <div className='block z-20 fixed'>
        <div className={`fixed ${sidebar && 'inset-0'}`} onClick={() => onClickOverlay()} aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className={`fixed bg-gray-50 h-[100dvh] flex w-80 duration-300 ${sidebar ? 'left-0' : '-left-80'}`}>
          <div className='w-full'>
            <div className='flex items-center h-16 shadow px-2'>
              <button className='p-2 rounded-full duration-300 hover:bg-primary-100' onClick={() => onClickOverlay()}>
                <BsList className='' size={'1.2rem'} />
              </button>
              <div className='p-2 text-xl'>{process.env.APP_NAME}</div>
            </div>
            <div className='mainContent py-2'>
              {menu.map((data, key) => {
                return (
                  <Menu key={key} name={data.name} icon={data.icon} path={data.path} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SidebarOperator;
