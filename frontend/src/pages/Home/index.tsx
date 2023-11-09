import Layout from "../../components/Layout";
import HomeMain from "../../components/Home/Home";
import ResponsiveDrawer from "../../components/Sidebar";

const Home = () => {
  return (
    // <Layout>
    <ResponsiveDrawer>
      <HomeMain />
    </ResponsiveDrawer>
    // </Layout>
  );
};

export default Home;
