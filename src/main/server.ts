import "module-alias/register";

import app from "@/main/config/app";

app.listen(80, () => {
  console.log("App is listening to port 80");
});
