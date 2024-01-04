
import ResponsiveDrawer from "../../components/Sidebar";
import Results from "../../components/Gallery/Results";
import InferenceQuery from "../../components/Gallery/InferenceQuery";

const Inference = () => {
  return (
    <ResponsiveDrawer>
      <InferenceQuery />
      <Results />
    </ResponsiveDrawer>
  );
};

export default Inference;
