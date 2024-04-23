const appid = ''
let imgURL = ''
let requestURL = ''
const WX_APPID = 'wx1efb69bc00140bc7'
const ALI_APPID = '2021001157673614'

if(process.env.NODE_ENV === 'development'){
    // 开发环境
    // requestURL = 'http://192.168.0.226:20173'
	// imgURL = 'http://192.168.0.226:20173'
 //    requestURL = 'https://xiaoda.mynatapp.cc'
	// imgURL = 'https://xiaoda.mynatapp.cc'
 //    requestURL = 'https://sndweb.mynatapp.cc'
	// imgURL = 'https://sndweb.mynatapp.cc'
	requestURL = 'https://sndcard.com'
	imgURL = 'https://sndcard.com'
}else{
    // 生产环境
 //    requestURL = 'https://xiaoda.mynatapp.cc'
	// imgURL = 'https://xiaoda.mynatapp.cc'
	
	// requestURL = 'http://sndfamily-test.mynatapp.cc'
	// imgURL = 'http://sndfamily-test.mynatapp.cc'
    requestURL = 'https://sndcard.com'
	imgURL = 'https://sndcard.com'
}

export { appid, imgURL, requestURL, WX_APPID, ALI_APPID }