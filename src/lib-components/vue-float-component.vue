<template>
  <div class="vue-float-component">
    <div
      v-if="!isDefault"
      v-on="floatComponentListeners"
      class="vue-float-component__main"
      ref="floatComponent"
    >
      <slot></slot>
    </div>
    <div
      v-else
      v-on="floatComponentListeners"
      ref="floatComponent"
      class="vue-float-component__default"
    >
      Float Component
    </div>
  </div>
</template>

<script>
export default {
  name: "VueFloatComponent",
  props: {
    isDefault: {
      type: Boolean,
      default: true,
    },
    timeoutClick: {
      type: Number,
      default: 200,
    },
    positionInit: {
      type: Object,
      default: () => ({
        PercentTop: 0.5,
        PercentLeft: 0.5,
      }),
    },
  },
  data() {
    return {
      action: "click",
      element: null,
      startX: null,
      startY: null,
      isMoving: false,
      currPosition: {},
    };
  },
  mounted() {
    this.element = this.$refs.floatComponent;
    this.setPosition(this.positionInit);

    document.addEventListener("mousemove", (e) => {
      if (this.isMoving) {
        var outWindow = this.outWindow(e);
        if (!outWindow.X) {
          this.element.style.left = e.clientX - this.startX + "px";
        }
        if (!outWindow.Y) {
          this.element.style.top = e.clientY - this.startY + "px";
        }
      }
    });
    window.addEventListener("resize", () => {
      if (
        this.$refs.floatComponent &&
        this.$refs.floatComponent.style &&
        this.$refs.floatComponent.style.display != "none"
      ) {
        this.setPosition(this.currPosition);
      }
    });
  },
  computed: {
    floatComponentListeners() {
      return Object.assign({}, this.$listeners, {
        mousedown: (e) => {
          this.action = "click";
          setTimeout(() => {
            this.action = "move";
          }, this.timeoutClick);
          this.clearSelection();
          this.startX =
            e.clientX - parseInt(getComputedStyle(this.element).left);
          this.startY =
            e.clientY - parseInt(getComputedStyle(this.element).top);
          this.isMoving = true;
          document.querySelector("body").style.userSelect = "none !important";
        },
        mouseleave: (e) => {
          if (this.isMoving) {
            var outWindow = this.outWindow(e);
            if (outWindow.X || outWindow.Y) {
              this.isMoving = false;
              document.querySelector("body").style.userSelect = "";
            }
            this.onStopMove();
          }
        },
        mouseup: (e) => {
          this.isMoving = false;
          document.querySelector("body").style.userSelect = "";
          this.onStopMove();
        },
      });
    },
  },
  methods: {
    setPosition(position) {
      if (this.element) {
        if (
          position &&
          position.PercentTop !== undefined &&
          position.PercentLeft !== undefined
        ) {
          var top = window.innerHeight * parseFloat(position.PercentTop);
          var left = window.innerWidth * parseFloat(position.PercentLeft);
          var rectElement = this.element.getBoundingClientRect();
          if (top + rectElement.height >= window.innerHeight) {
            this.element.style.top =
              window.innerHeight - rectElement.height + "px";
          } else {
            this.element.style.top = top + "px";
          }
          if (left + rectElement.width >= window.innerWidth) {
            this.element.style.left =
              window.innerWidth - rectElement.width + "px";
          } else {
            this.element.style.left = left + "px";
          }
        }
      } else {
        this.element.style.top = "20px";
        this.element.style.left = "20px";
      }
    },
    outWindow(e) {
      var result = { X: true, Y: true };
      if (this.element) {
        var rectElement = this.element.getBoundingClientRect();
        var positionX = e.clientX - this.startX;
        var positionY = e.clientY - this.startY;
        if (
          positionX >= 0 &&
          positionX + rectElement.width <= window.innerWidth
        ) {
          result.X = false;
        }
        if (
          positionY >= 0 &&
          positionY + rectElement.height <= window.innerHeight
        ) {
          result.Y = false;
        }
        return result;
      }
    },
    clearSelection() {
      if (window.getSelection()) {
        if (window.getSelection().empty) {
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection) {
        document.selection.empty();
      }
    },
    getPercentDistance() {
      if (this.element) {
        var rectElement = this.element.getBoundingClientRect();
        var PercentTop = Number.parseFloat(
          rectElement.top / window.innerHeight
        ).toFixed(5);

        var PercentLeft = Number.parseFloat(
          rectElement.left / window.innerWidth
        ).toFixed(5);
        return { PercentTop, PercentLeft };
      } else {
        return { PercentTop: 0, PercentLeft: 0 };
      }
    },
    onStopMove() {
      this.currPosition = this.getPercentDistance();
      this.$emit("stopMove", this.currPosition);
    },
  },
  watch: {
    positionInit: {
      handler(val) {
        this.currPosition = val;
        this.setPosition(this.currPosition);
      },
    },
  },
};
</script>

<style>
.vue-float-component__main {
  position: fixed;
  user-select: none;
}
.vue-float-component__default {
  position: fixed;
  user-select: none;
  height: 100px;
  width: 100px;
  background-color: pink;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  display: flex;
  align-items: center;
}
.vue-float-component__default:hover,
.vue-float-component__main:hover {
  cursor: move;
}
</style>
