//=============================================================================
// ReplacePictureName.js
// ----------------------------------------------------------------------------
// <利用規約>
//  利用はRPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
//  商用、非商用、ゲームの内容を問わず利用可能です。
//  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
//  二次配布や転載は禁止します。
//  ソースコードURL、ダウンロードURLへの直接リンクも禁止します。
//  不具合対応以外のサポートやリクエストは受け付けておりません。
//  スクリプト利用により生じたいかなる問題においても、一切責任を負いかねます。
// ----------------------------------------------------------------------------
//  Ver1.00  2016/01/24  初版
//  Ver1.01  2019/12/28  ツクールMV最新版対応
//=============================================================================

/*:
 * @plugindesc 画像、音声、動画読み込み時、指定された名前を任意の名前に置き換えて読み込むようにします。
 * @author こま
 *
 * @help 使い方については、プラグインに同梱されているドキュメントをご参照ください。
 */

(function(){
    var ReplaceNameList = {
        img:{
            "img/parallaxes/黑.png":"img/parallaxes/Material0001.png", 
            "img/pictures/QQ?片20221223225027.jpg":"img/pictures/Material0002.jpg", 
            "img/pictures/下北?立?1.png":"img/pictures/Material0003.png", 
            "img/pictures/下北?立?2.png":"img/pictures/Material0004.png", 
            "img/pictures/喜多立?1.png":"img/pictures/Material0005.png", 
            "img/pictures/喜多立?2.png":"img/pictures/Material0006.png", 
            "img/pictures/山田凉立?1.png":"img/pictures/Material0007.png", 
            "img/pictures/小虹立?1.png":"img/pictures/Material0008.png", 
            "img/pictures/小虹立?2.png":"img/pictures/Material0009.png", 
            "img/pictures/小虹立?3.png":"img/pictures/Material0010.png", 
            "img/pictures/星歌立?1.png":"img/pictures/Material0011.png", 
            "img/pictures/星歌立?2.png":"img/pictures/Material0012.png", 
            "img/pictures/星歌立?3.png":"img/pictures/Material0013.png", 
            "img/pictures/虹夏立?1.png":"img/pictures/Material0014.png", 
            "img/pictures/虹夏立?2.png":"img/pictures/Material0015.png", 
            "img/pictures/虹夏立?3.png":"img/pictures/Material0016.png", 
            "img/pictures/虹夏立?4.png":"img/pictures/Material0017.png", 
            "img/pictures/虹夏立?5.png":"img/pictures/Material0018.png", 
            "img/pictures/虹夏立?6.png":"img/pictures/Material0019.png", 
            "img/pictures/虹夏立?7.png":"img/pictures/Material0020.png", 
            "img/pictures/附加CG.png":"img/pictures/Material0021.png", 
            "img/pictures/凉立?1.png":"img/pictures/Material0022.png", 
            "img/pictures/凉立?2.png":"img/pictures/Material0023.png", 
            "img/pictures/凉立?3.png":"img/pictures/Material0024.png", 
            "img/pictures/凉立?4.png":"img/pictures/Material0025.png", 
            "img/pictures/凉立?5.png":"img/pictures/Material0026.png", 
            "img/pictures/黑.png":"img/pictures/Material0027.png", 
            "img/tilesets/各??格地?60?-2_??网_aigei_com.png":"img/tilesets/Material0028.png", 
            "img/tilesets/各??格地?60?-newporttown_??网_aigei_com.png":"img/tilesets/Material0029.png", 
            "img/tilesets/各??格地?60?-火?站(TrainStation)_??网_aigei_com.png":"img/tilesets/Material0030.png", 
            "img/tilesets/?代地?合集2-T4(t4)_??网_aigei_com.png":"img/tilesets/Material0031.png", 
        },
        audio:{
            "audio/bgm/V.A. - 音楽の卵_幸せな日々.ogg":"audio/bgm/Material0032.ogg", 
            "audio/bgm/V.A. - 音楽の卵_準備する人たち.ogg":"audio/bgm/Material0033.ogg", 
            "audio/bgm/V.A. - 音楽の卵_小さな楽しみ.ogg":"audio/bgm/Material0034.ogg", 
            "audio/bgm/植松伸夫,島翔太朗 - 旅の途中で.ogg":"audio/bgm/Material0035.ogg", 
            "audio/bgm/青春コンプレックス_TV_size__Drum.ogg":"audio/bgm/Material0036.ogg", 
            "audio/bgm/青春コンプレックス_TV_size__Drum_Bass_modified_.ogg":"audio/bgm/Material0037.ogg", 
            "audio/bgm/大久保賢,森祐紀 - 一人の夜.ogg":"audio/bgm/Material0038.ogg", 
            "audio/bgm/白い花 音楽の卵 - 1.白い花 音楽の卵(Av292682498,P1).ogg":"audio/bgm/Material0039.ogg", 
            "audio/bgm/浜渦正志 - 宴.ogg":"audio/bgm/Material0040.ogg", 
            "audio/bgm/北澤伸一郎 - 回想.ogg":"audio/bgm/Material0041.ogg", 
            "audio/bgm/北澤伸一郎 - 回想.ogg":"audio/bgm/Material0042.ogg", 
            "audio/bgm/裏谷玲央 - 淡い夕日.ogg":"audio/bgm/Material0043.ogg", 
            "audio/bgm/林ゆうき - 思い出.ogg":"audio/bgm/Material0044.ogg", 
        },
        movies:{
        }
    };
    
    var _Bitmap_load = Bitmap.load;
    Bitmap.load = function(url) {
        var _url = decodeURIComponent(url);
        if (ReplaceNameList.img.hasOwnProperty(_url)) {
            url = ReplaceNameList.img[_url];
        }
        return _Bitmap_load.call(this, url);
    };
    
    var _Bitmap_request = Bitmap.request;
    Bitmap.request = function(url) {
        var _url = decodeURIComponent(url);
        if (ReplaceNameList.img.hasOwnProperty(_url)) {
            url = ReplaceNameList.img[_url];
        }
        return _Bitmap_request.call(this, url);
    };
    
    var _Html5Audio_setup = Html5Audio.setup;
    Html5Audio.setup = function (url) {
        var _url = decodeURIComponent(url);
        if (ReplaceNameList.audio.hasOwnProperty(_url)) {
            url = ReplaceNameList.audio[_url];
        }
        _Html5Audio_setup.call(this, url);
    };

    var _WebAudio_initialize = WebAudio.prototype.initialize;
    WebAudio.prototype.initialize = function(url) {
        var _url = decodeURIComponent(url);
        if (ReplaceNameList.audio.hasOwnProperty(_url)) {
            url = ReplaceNameList.audio[_url];
        }
        _WebAudio_initialize.call(this, url);
    };
    
    var _Graphics_playVideo = Graphics.playVideo;
    Graphics.playVideo = function(src) {
        if (ReplaceNameList.movies.hasOwnProperty(src)) {
            src = ReplaceNameList.movies[src];
        }
        _Graphics_playVideo.call(this, src);
    };
}());
