import { YuqueSDK } from "../src/index"

console.log(process.env.TOKEN);

describe("YuqueSDK", () => {
  let testUser;

  let yuque: YuqueSDK;
  beforeAll( done => {
    yuque = new YuqueSDK(process.env.TOKEN as string);
    yuque.user().then( res => {
      testUser = res.data;
      done();
    }).catch( err => {
      console.log(err);
      done();
    })
  })

  it("get user profile", async () => {

    const docslist = await yuque.docs()
    console.log(docslist.data);
  })
})
