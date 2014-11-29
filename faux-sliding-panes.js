/*
	Inline Message (sliding pane)
	Date: 2014-11-27
*/
//
//	Message is displayed in the <div id="mId" class="mSlidingClass {mHidingClass}"></div>
//
var SlidingPane = {
	gObjectId    : undefined,
	gSlidingTime : 1200,
	gHideTime    : 100,

	init : function (mId, mSlideTime, mHideTime) {
		gObjectId  = mId;
		if (mSlideTime) {
			this.gSlidingTime = mSlideTime;
		}
		if (mHideTime) {
			this.gHideTime    = mHideTime;
		}
	},

	//	* This object just toggles the object between visible and invisible.
	Toggle : function (mId, mHidingClass, mSlidingClass) {
		

		if ( $(mId).hasClass(mHidingClass) ) {
			$(mId).removeClass(mHidingClass);
			console.log("remove hiding.");
		} else {
			// NOTE: we are waiting for the element to slide out of view before we hide it.
			window.setTimeout(function(){
				$(mId).addClass(mHidingClass);
				console.log("add hiding.");
			}, this.gSlidingTime);
		}

		window.setTimeout(function() {
			if ( $(mId).hasClass(mSlidingClass) ) {
				$(mId).removeClass(mSlidingClass);
				console.log("remove sliding.");
			} else {
				$(mId).addClass(mSlidingClass);
				console.log("add sliding.");
			}
		}, this.gHideTime);
	}
}
