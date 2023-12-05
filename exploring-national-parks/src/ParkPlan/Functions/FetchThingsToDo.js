export const FetchThingsToDo = async (parkCode, activities, dates) => {
    try {
        console.log("parkCode2", parkCode.value);
        console.log("activities2", activities);
        console.log("dates2", dates);
      return ;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  export default FetchThingsToDo;