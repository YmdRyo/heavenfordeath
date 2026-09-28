//=============================================================================
// Saveフォルダ標準化.js  2016/07/30
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc Saveフォルダ標準化プラグイン
 * @author Minami
 *
 * @help MVのバージョンでSaveフォルダが変な所になっていることがあるので
 * それを標準位置にするためのプラグインです。
 * ON後のSaveフォルダは\www\saveになります。
 */

(function(_global) {
    // ここにプラグイン処理を記載

	StorageManager.localFileDirectoryPath = function() {
	    var path = require('path');

	    var base = path.dirname(process.mainModule.filename);
	    return path.join(base, 'Save/');
};
})(this);