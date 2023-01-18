import React from 'react'
import ShopSidebarOne from '~/components/partials/shop/sidebar/shop-sidebar-one'
import ShopSidebarThree from '~/components/partials/shop/sidebar/shop-sidebar-three'
import { connect } from "react-redux";
import Ecombo from './ecombo';
function Combo() {
     return (
          <div className="container">


               <Ecombo />



               <ShopSidebarThree />




          </div>


     )
}
const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(
     Combo
);
