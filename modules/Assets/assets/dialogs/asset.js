export default {

    data() {

        return {
            ASSETS_BASE_URL: window.ASSETS_BASE_URL,
            item: null,
            loading: true
        }
    },

    props: {
        asset: {
            type: Object
        }
    },

    mounted() {

        this.loading = true;

        this.$request(`/assets/asset/${this.asset._id}`, {asset:this.asset}).then(asset => {
            this.item = asset;
            this.loading = false;
        }).catch(rsp => {
            App.ui.notify(rsp.error || 'Asset not found!', 'error');
        });
    },

    computed: {
        size() {
            return App.utils.formatSize(this.item.size);
        }
    },

    template: /*html*/`

        <div class="app-offcanvas-container">
            <div class="kiss-padding kiss-text-bold kiss-flex kiss-flex-middle">
                <div class="kiss-margin-small-right"><icon size-larger>create</icon></div>
                {{ t('Edit asset') }}
            </div>
            <div class="app-offcanvas-content kiss-padding">

                <app-loader v-if="!item"></app-loader>

                <form v-if="item" @submit.prevent="update">

                    <div class="kiss-bgcolor-contrast kiss-position-relative kiss-padding kiss-margin-bottom" :class="{'kiss-bgcolor-transparentimage': item.type == 'image'}">
                        <canvas width="400" height="150"></canvas>
                        <div class="kiss-cover kiss-align-center kiss-flex kiss-flex-middle kiss-flex-center"><asset-preview :asset="item"></asset-preview></div>
                        <div class="kiss-cover kiss-padding-small">
                            <span class="kiss-badge">{{ item.mime }}</span>
                        </div>
                        <a class="kiss-cover" :href="ASSETS_BASE_URL+item.path" target="_blank" rel="noopener"></a>
                    </div>


                    <div class="kiss-margin-small">
                        <label>{{ t('Title') }}</label>
                        <input class="kiss-input" type="text" v-model="item.title">
                    </div>

                    <div class="kiss-margin-small">
                        <label>{{ t('Description') }}</label>
                        <textarea class="kiss-input" v-model="item.description"></textarea>
                    </div>

                    <div class="kiss-margin-small" v-if="item.type == 'image' && Array.isArray(item.colors) && item.colors.length">
                        <label>{{ t('Colors') }}</label>
                        <div class="kiss-size-4">
                            <a class="kiss-margin-xsmall-right" :style="{color}" :title="color" @click="copyColor(color)" v-for="color in item.colors"><icon>invert_colors</icon></a>
                        </div>
                    </div>

                    <div class="kiss-margin-small kiss-color-muted kiss-text-monospace kiss-size-small">
                        {{ size }}
                    </div>

                </form>

            </div>
            <hr class="kiss-width-1-1 kiss-margin-remove">
            <div class="kiss-padding kiss-padding-remove-bottom kiss-bgcolor-contrast kiss-size-small" v-if="item">
                <div>
                    <div class="kiss-flex kiss-flex-middle">
                            <div class="kiss-size-4 kiss-margin-small-right kiss-flex kiss-color-muted" :title="t('Created at')"><icon>more_time</icon></div>
                            <div class="kiss-text-truncate kiss-size-small kiss-text-monospace kiss-color-muted kiss-flex-1">{{ (new Date(item._created * 1000).toLocaleString()) }}</div>
                            <div><icon>account_circle</icon></div>
                        </div>
                    </div>

                    <div v-if="item._created != item._modified">
                        <div class="kiss-flex kiss-flex-middle">
                            <div class="kiss-size-4 kiss-margin-small-right kiss-flex kiss-color-muted" :title="t('Modified at')"><icon>history</icon></div>
                            <div class="kiss-text-truncate kiss-size-small kiss-text-monospace kiss-color-muted kiss-flex-1">{{ (new Date(item._modified * 1000).toLocaleString()) }}</div>
                            <div><icon>account_circle</icon></div>
                        </div>
                    </div>
            </div>
            <div class="kiss-padding kiss-bgcolor-contrast">
                <div class="kiss-button-group kiss-flex kiss-child-width-1-2">
                    <button class="kiss-button" kiss-offcanvas-close>{{ t('Close') }}</button>
                    <button class="kiss-button kiss-button-primary" :disabled="!item || loading" @click="update()">{{ t('Update') }}</button>
                </div>
            </div>
        </div>
    `,

    methods: {

        copyColor(color) {
            App.utils.copyText(color, () =>  App.ui.notify('Color copied!'));
        },

        replace() {

        },

        update() {

            this.$request('/assets/update', {asset: this.item}).then(asset => {

                Object.assign(this.item, asset);
                this.$call('update', asset);
                App.ui.notify('Asset updated!');
            }).catch(rsp => {
                App.ui.notify(rsp.error || 'Updating asset failed!', 'error');
            });
        }
    }
}